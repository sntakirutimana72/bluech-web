import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import GetStarted from '../../components/GetStarted'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<GetStarted />} />
      <Route path="users/login" element={<div>Login Page</div>} />
    </Routes>
  </Router>
)

test('renders successfully', () => {
  render(<Component />)
  expect(screen.getByRole('link', { name: 'Join Us' })).toBeInTheDocument()
})

test('[Join Us] leads to login page', () => {
  render(<Component />)

  const joinUs = screen.getByText(/Join Us/)
  fireEvent.click(joinUs)
  waitForElementToBeRemoved(joinUs)
  expect(screen.getByText(/Login Page/)).toBeInTheDocument()
})
