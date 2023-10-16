import {
  MemoryRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom'
import { fireEvent, screen, act } from '@testing-library/react'
import { InboxController } from '@/controllers/v1'
import routes from '@/config/routes'
import Inbox from '@/components/Inbox'
import { reduxRender, TestReduxStore } from '#test-support/render'
import Spy from '#test-support/mocks/spy'
import Generic from '#test-support/mocks/generic'

const Component = () => (
  <Router>
    <Routes>
      <Route index element={<Inbox />} />
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

describe('<Inbox />', () => {
  afterEach(() => {
    localStorage.clear()
    TestReduxStore.clear()
  })

  afterAll(() => Generic.clear())

  const previews = [
    Generic.inboxPreview(),
    Generic.inboxPreview(),
    Generic.inboxPreview(),
  ]

  test('renders without inbox previews', async () => {
    Spy.rejected(InboxController, 'preview')
    await act(async () => { reduxRender(<Component />) })
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
  })

  test('refresh button behavior', async () => {
    const agent = Spy.rejected(InboxController, 'preview')
    await act(async () => { reduxRender(<Component />) })

    agent.mockResolvedValue(previews)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    })
    expect(screen.queryAllByRole('link')).toHaveLength(previews.length)
  })

  test('renders previews', async () => {
    Spy.resolved(InboxController, 'preview', previews)

    await act(async () => { reduxRender(<Component />) })

    const links = screen.queryAllByRole('link')
    expect(links).toHaveLength(previews.length)
    fireEvent.click(links[0])
    expect(screen.getByText(/Chatroom/)).toBeInTheDocument()
  })
})
