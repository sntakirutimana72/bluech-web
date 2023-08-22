import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { act, screen, fireEvent } from '@testing-library/react'
import { TestCable } from '@anycable/core/testing'
import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { appRender } from '../support/render'
import { UsersController } from '../../controllers'
import { InboxController, MessagesController } from '../../controllers/v1'
import ApplicationChannel from '../../channels/applicationChannel'
import * as useCable from '../../hooks/cable'
import * as chatsChannel from '../../channels/chatsChannel'
import Dashboard from '../../components/Dashboard'
import ChatRoom from '../../components/ChatRoom'
import Inbox from '../../components/Inbox'

class CustomChatChannel extends ApplicationChannel {
  static readonly identifier = 'ChatsChannel'
}

const Main = () => (
  <Router initialEntries={['/dashboard']}>
    <Routes>
      <Route path="dashboard" element={<Dashboard />}>
        <Route index element={<Inbox />} />
        <Route path="chats/:channelId" element={<ChatRoom />} />
      </Route>
    </Routes>
  </Router>
)

describe('Dashboard', () => {
  const cable = new TestCable()
  // eslint-disable-next-line new-cap
  const channel = new CustomChatChannel()
  const currentUser = Generic.currentUser()
  const partner = Generic.personnel()
  const newTypedMessage = Generic.cableMessage()

  newTypedMessage.author = currentUser as CableMessageAuthor
  newTypedMessage.desc = 'NEW_GENERIC_TYPED_MSG'

  beforeEach(() => {
    // eslint-disable-next-line prefer-arrow-callback, func-names
    Spy.returned(chatsChannel, 'default', channel)
    Spy.returned(useCable, 'default', { cable })
    Spy.resolved(UsersController, 'signedUser', currentUser)
    Spy.resolved(InboxController, 'preview', [Generic.inboxPreview(partner.id)])
    Spy.resolved(UsersController, 'people', {
      people: [partner],
      pagination: { current: 1, pages: 1 },
    })
    Spy.resolved(MessagesController, 'conversation', {
      chats: [],
      pagination: {},
    })
    Spy.resolved(MessagesController, 'create', newTypedMessage)
  })
  afterEach(() => { localStorage.clear() })
  afterAll(() => { Generic.resetAll() })

  test('renders successfully', async () => {
    await act(async () => { appRender(<Main />) })
    expect(await screen.findByTitle('Preview')).toBeInTheDocument()
  })

  test('renders new message', async () => {
    await act(async () => { appRender(<Main />) })
    // Navigate to chatroom
    const previewLink = await screen.findByTitle('Preview')
    await act(async () => { fireEvent.click(previewLink) })
    expect(await screen.findByRole('heading', { name: partner.name })).toBeInTheDocument()
    // Simulate typing message event
    const author = partner as CableMessageAuthor
    const message = Generic.cableMessage(undefined, partner.id)
    message.desc = 'NEW_GENERIC_DESCRIPTION'
    await act(async () => {
      channel.receive({ type: 'typing', author })
      channel.receive({ type: 'message', message })
    })
    // expect typing message to have been rendered and visible on screen
    expect(await screen.findByText(`${partner.name} is typing..`)).toBeInTheDocument()
    expect(await screen.findByText(message.desc)).toBeInTheDocument()
    // Simulate new typed message
    const prompt = screen.getByPlaceholderText<HTMLInputElement>(/Enter Message/)
    fireEvent.change(prompt, { target: { value: newTypedMessage.desc } })
    expect(prompt.value).toEqual(newTypedMessage.desc)
    expect(cable.outgoing).toEqual([
      { action: 'typing', payload: { channelId: partner.id.toString() } },
    ])
    // Create new typed message
    await act(async () => { fireEvent.click(screen.getByTitle(/Send/)) })
    expect(await screen.findByText(newTypedMessage.desc)).toBeInTheDocument()
  })
})
