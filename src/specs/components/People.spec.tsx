import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  waitFor,
  fireEvent,
  screen,
  act,
  cleanup,
} from '@testing-library/react'
import Spy from '../support/mocks/spy'
import Generic from '../support/mocks/generic'
import { reduxRender } from '../support/render'
import PeopleList from '../../components/People'
import * as PeopleSelectors from '../../redux/effects/peopleEffects'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<PeopleList />} />
      <Route path="dashboard/chats/:id" element={<div>Chatroom</div>} />
    </Routes>
  </Router>
)

afterEach(() => {
  localStorage.clear()
  cleanup()
})

test('renders without people', async () => {
  await act(async () => { reduxRender(<Component />) })

  expect(screen.queryByTestId('ball-loader')).toBeFalsy()
  expect(screen.queryByRole('button', { name: 'Refresh' })).toBeTruthy()
})

test('refresh button behavior', async () => {
  reduxRender(<Component />)

  act(() => {
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
  })
  await waitFor(() => {
    expect(screen.queryByTestId('ball-loader')).toBeTruthy()
  })
})

test('renders with people', async () => {
  Spy.returned(PeopleSelectors, 'peopleSelector', {
    status: 'loaded',
    people: [
      Generic.personnel(17),
      Generic.personnel(13),
      Generic.personnel(7),
    ],
    pagination: {
      current: 1,
      pages: 2,
    },
  })
  reduxRender(<Component />)

  const links = screen.queryAllByRole('link')
  expect(links).toHaveLength(3)
  fireEvent.click(links[0])
  expect(screen.getByText(/Chatroom/)).toBeInTheDocument()
})
