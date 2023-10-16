import { useEffect } from 'react'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { act, screen } from '@testing-library/react'
import { TestCable } from '@anycable/core/testing'
import { UsersController } from '@/controllers'
import { MessagesController } from '@/controllers/v1'
import { populateConversation } from '@/redux/features/chatsSlice'
import { populatePeople } from '@/redux/features/peopleSlice'
import { peopleSelector } from '@/redux/effects/peopleEffects'
import { useAppSelector, useAppDispatch } from '@/hooks'
import * as useCable from '@/hooks/cable'
import routes from '@/config/routes'
import Chatroom from '@/components/Chatroom'
import { appRender, TestReduxStore } from '#test-support/render'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

type Props = { id: AlphaNumeric }

const CustomPeople = ({ id }: Props) => {
  const { status } = useAppSelector(peopleSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(populateConversation({ channelId: id }))
      dispatch(populatePeople(1))
    }
  })
  return (
    status === 'loaded'
      ? <Navigate to={`chats/${id}`} replace />
      : <div>{status}</div>
  )
}

const Main = ({ id }: Props) => (
  <Router>
    <Routes>
      <Route index element={<CustomPeople id={id} />} />
      <Route path={routes.home.CHATROOM} element={<Chatroom />} />
    </Routes>
  </Router>
)

describe('<Chatroom />', () => {
  const cable = new TestCable()
  const currentUser = Generic.currentUser()
  const partner = Generic.personnel()
  const chats = [
    Generic.cableMessage(undefined, currentUser.id),
    Generic.cableMessage(undefined, partner.id),
  ]

  beforeEach(() => {
    Spy.returned(useCable, 'default', { cable })
    Spy.resolved(UsersController, 'signedUser', currentUser)
    Spy.resolved(UsersController, 'people', {
      people: [partner], pagination: { current: 1, pages: 1 },
    })
    Spy.resolved(MessagesController, 'conversation', {
      chats, pagination: { current: 1, pages: 1 },
    })
    Spy.resolved(MessagesController, 'markAsRead', [chats[1].id.toString()])
  })

  afterEach(() => {
    localStorage.clear()
    TestReduxStore.clear()
  })

  afterAll(() => Generic.clear())

  test('renders successfully', async () => {
    await act(async () => { appRender(<Main id={partner.id} />) })

    expect(await screen.findByRole('heading', { name: partner.name })).toBeInTheDocument()
    expect(await screen.findAllByText(chats[0].desc)).toHaveLength(chats.length)
    const { chats: { messages } } = TestReduxStore.getState()
    expect(messages[partner.id].chats.find(({ isSeen }) => isSeen)).not.toBeNull()
  })
})
