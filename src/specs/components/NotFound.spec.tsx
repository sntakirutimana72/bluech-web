import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react'
import NotFound from '../../components/NotFound'

const Component = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<NotFound />} />
      <Route path="dashboard" element={<div>DASHBOARD</div>} />
    </Routes>
  </BrowserRouter>
)

test('renders successfully', () => {
  render(<Component />)
  expect(screen).toMatchSnapshot()
  expect(screen.getByRole('link', { name: 'Home' }))
})

test('redirects to dashboard', async () => {
  render(<Component />)
  fireEvent.click(screen.getByRole('link'))
  await waitFor(() => {
    expect(screen.queryByRole('link', { name: 'Home' })).toBeNull()
    expect(screen.queryByText(/dashboard/i)).toBeTruthy()
  })
})
