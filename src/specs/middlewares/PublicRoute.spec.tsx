import {
  MemoryRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import { screen, render } from '@testing-library/react'
import { PublicRoute, PrivateRoute } from '@/middlewares'

type Props = {
  authenticated?: boolean
  entry?: string
}

const GetStarted = () => {
  const { state } = useLocation()

  return (
    <div data-testid="get-started">
      { state && <span data-testid="nextTo">{ state.nextTo }</span> }
    </div>
  )
}

const CustomApp = ({ authenticated, entry = '/' }: Props) => (
  <div>
    <Router initialEntries={[entry]}>
      <Routes>
        <Route element={<PublicRoute redirectTo="/home" authenticated={authenticated} />}>
          <Route index element={<GetStarted />} />
        </Route>
        <Route element={<PrivateRoute redirectTo="/" authenticated={authenticated} />}>
          <Route path="home" element={<div data-testid="home" />} />
        </Route>
      </Routes>
    </Router>
  </div>
)

describe('<PublicRoute />', () => {
  test('&:authenticated is FALSE', () => {
    render(<CustomApp />)
    expect(screen.queryByTestId('home')).not.toBeInTheDocument()
    expect(screen.getByTestId('get-started')).toBeInTheDocument()
    expect(screen.queryByTestId('nextTo')).not.toBeInTheDocument()
  })

  test('&:authenticated is TRUE', () => {
    render(<CustomApp authenticated />)
    expect(screen.queryByTestId('get-started')).not.toBeInTheDocument()
    expect(screen.getByTestId('home')).toBeInTheDocument()
  })

  test('&:nextTo redirect state', () => {
    render(<CustomApp entry="/home" />)
    expect(screen.queryByTestId('home')).not.toBeInTheDocument()
    expect(screen.getByTestId('nextTo')).toBeInTheDocument()
  })
})
