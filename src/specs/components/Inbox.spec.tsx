import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  fireEvent,
  screen,
  act,
  cleanup,
} from '@testing-library/react'
import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { reduxRender, TestReduxStore } from '../support/render'
import { InboxController } from '../../controllers/v1'
import Inbox from '../../components/Inbox'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<Inbox />} />
      <Route path="dashboard/chats/:id" element={<div>Chatroom</div>} />
    </Routes>
  </Router>
)

const previews = [
  Generic.inboxPreview(),
  Generic.inboxPreview(),
  Generic.inboxPreview(),
]

afterEach(() => {
  localStorage.clear()
  TestReduxStore.clear()
  cleanup()
})
afterAll(() => {
  Generic.clear()
})

test('renders without inbox previews', async () => {
  Spy.rejected(InboxController, 'preview')
  await act(async () => { reduxRender(<Component />) })
  expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
})

test('refresh button behavior', async () => {
  const agent = Spy.rejected(InboxController, 'preview')
  await act(async () => { reduxRender(<Component />) })

  agent.mockResolvedValue(previews)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  })
  expect(screen.queryAllByRole('link')).toHaveLength(previews.length)
})

test('renders previews', async () => {
  Spy.resolved(InboxController, 'preview', previews)

  await act(async () => { reduxRender(<Component />) })

  const links = screen.queryAllByRole('link')
  expect(links).toHaveLength(previews.length)
  fireEvent.click(links[0])
  expect(screen.getByText(/Chatroom/)).toBeInTheDocument()
})
