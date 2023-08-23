import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import NotFound from '../../components/NotFound'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<NotFound />} />
      <Route path="dashboard" element={<div>DASHBOARD</div>} />
    </Routes>
  </Router>
)

test('renders successfully', () => {
  render(<Component />)
  expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
})

test('redirects to dashboard', async () => {
  render(<Component />)
  fireEvent.click(screen.getByRole('link'))
  expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
})
