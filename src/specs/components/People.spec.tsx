import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  fireEvent,
  screen,
  act,
  cleanup,
} from '@testing-library/react'
import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { reduxRender } from '../support/render'
import PeopleList from '../../components/People'
import { UsersController } from '../../controllers'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<PeopleList />} />
      <Route path="dashboard/chats/:id" element={<div>Chatroom</div>} />
    </Routes>
  </Router>
)

const personnels = [
  Generic.personnel(18),
  Generic.personnel(13),
  Generic.personnel(7),
]

afterEach(() => {
  cleanup()
  localStorage.clear()
})

test('renders without people', async () => {
  Spy.rejected(UsersController, 'people')
  await act(async () => { reduxRender(<Component />) })

  expect(screen.queryByTestId('ball-loader')).toBeFalsy()
  expect(screen.queryByRole('button', { name: 'Refresh' })).toBeTruthy()
})

test('renders people after a refresh', async () => {
  const spyware = Spy.rejected(UsersController, 'people')
  await act(async () => { reduxRender(<Component />) })

  spyware.mockResolvedValue({
    people: [personnels[0]],
    pagination: { current: 1, pages: 1 },
  })

  expect(screen.queryAllByRole('link')).toHaveLength(0)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  })
  expect(screen.queryAllByRole('link')).toHaveLength(1)
})

test('renders with people', async () => {
  Spy.resolved(UsersController, 'people', {
    people: personnels,
    pagination: { current: 1, pages: 2 },
  })
  await act(async () => { reduxRender(<Component />) })

  const links = screen.queryAllByRole('link')
  expect(links).toHaveLength(personnels.length)
  fireEvent.click(links[0])
  expect(screen.getByText(/Chatroom/)).toBeInTheDocument()
})
