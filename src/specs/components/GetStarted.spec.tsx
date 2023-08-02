import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react'
import GetStarted from '../../components/GetStarted'

const Component = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<GetStarted />} />
      <Route path="users/login" element={<div>Login Page</div>} />
    </Routes>
  </BrowserRouter>
)

test('renders successfully', () => {
  render(<Component />)
  expect(screen).toMatchSnapshot()
  expect(screen.getByRole('link', { name: 'Join Us' }))
})

test('redirects to login page', async () => {
  render(<Component />)
  fireEvent.click(screen.getByText(/Join Us/))
  await waitFor(() => {
    expect(screen.queryByText(/Join Us/)).toBeNull()
    expect(screen.queryByText(/Login Page/)).toBeTruthy()
  })
})
