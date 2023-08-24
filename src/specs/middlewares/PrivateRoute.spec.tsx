import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { screen, render } from '@testing-library/react'
import { PrivateRoute } from '../../middlewares'

type Props = { authenticated?: boolean }

const CustomApp = ({ authenticated }: Props) => (
  <div>
    <Router>
      <Routes>
        <Route path="/public" element={<div data-testid="public" />} />
        <Route element={<PrivateRoute redirectTo="/public" authenticated={authenticated} />}>
          <Route index element={<div data-testid="private" />} />
        </Route>
      </Routes>
    </Router>
  </div>
)

test('&:authenticated is TRUE', async () => {
  render(<CustomApp authenticated />)
  expect(screen.queryByTestId('public')).not.toBeInTheDocument()
  expect(screen.getByTestId('private')).toBeInTheDocument()
})

test('&:authenticated is FALSE', async () => {
  render(<CustomApp />)
  expect(screen.queryByTestId('private')).not.toBeInTheDocument()
  expect(screen.getByTestId('public')).toBeInTheDocument()
})
