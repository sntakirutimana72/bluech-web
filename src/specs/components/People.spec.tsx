import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import { fireEvent, screen, act } from '@testing-library/react'
import { UsersController } from '@/controllers'
import routes from '@/config/routes'
import PeopleList from '@/components/People'
import { reduxRender, TestReduxStore } from '#test-support/render'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<PeopleList />} />
      <Route
        path={routes.home.INDEX}
        element={(
          <>
            Homepage
            <Outlet />
          </>
        )}
      >
        <Route index element={<div>Aux Content</div>} />
        <Route path={routes.home.CHATROOM} element={<div>Chatroom</div>} />
      </Route>
    </Routes>
  </Router>
)

describe('<People />', () => {
  afterEach(() => {
    localStorage.clear()
    TestReduxStore.clear()
  })

  afterAll(() => Generic.clear())

  const personnels = [
    Generic.personnel(),
    Generic.personnel(),
    Generic.personnel(),
  ]

  test('renders without people', async () => {
    Spy.rejected(UsersController, 'people')
    await act(async () => { reduxRender(<Component />) })

    expect(screen.queryByTestId('ball-loader')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
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
})
