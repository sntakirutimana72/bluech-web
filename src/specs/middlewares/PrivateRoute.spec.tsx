import { screen, render } from '@testing-library/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
  expect(screen.queryByTestId('public')).toBeNull()
  expect(screen.queryByTestId('private')).not.toBeNull()
})

test('&:authenticated is FALSE', async () => {
  render(<CustomApp />)
  expect(screen.queryByTestId('private')).toBeNull()
  expect(screen.queryByTestId('public')).not.toBeNull()
})
