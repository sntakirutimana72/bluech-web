import { screen, render, fireEvent } from '@testing-library/react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { RedirectedRoute, PrivateRoute } from '../../middlewares'

type Props = { authenticated?: boolean }

const GetStarted = () => {
  const { state } = useLocation()
  return (
    <div data-testid="get-started">
      { state && <span data-testid="nextTo">{ state.nextTo }</span> }
    </div>
  )
}

const CustomApp = ({ authenticated }: Props) => (
  <div>
    <a href="/home">Go To Home</a>
    <Router>
      <Routes>
        <Route element={<PrivateRoute redirectTo="/" />}>
          <Route path="/home" element={<div data-testid="home" />} />
        </Route>
        <Route element={<RedirectedRoute redirectTo="/home" authenticated={authenticated} />}>
          <Route index element={<GetStarted />} />
        </Route>
      </Routes>
    </Router>
  </div>
)

test('&:authenticated is TRUE', async () => {
  render(<CustomApp authenticated />)
  expect(screen.queryByTestId('get-started')).toBeNull()
  expect(screen.queryByTestId('home')).not.toBeNull()
})

test('&:authenticated is FALSE', async () => {
  render(<CustomApp />)
  expect(screen.queryByTestId('home')).toBeNull()
  expect(screen.queryByTestId('get-started')).not.toBeNull()
  expect(screen.queryByTestId('nextTo')).toBeNull()
})

test('&:nextTo redirect state', async () => {
  render(<CustomApp />)
  expect(screen.queryByTestId('nextTo')).toBeNull()
  fireEvent.click(screen.getByText(/Go To Home/))
  expect(screen.queryByTestId('nextTo')).not.toBeNull()
})
