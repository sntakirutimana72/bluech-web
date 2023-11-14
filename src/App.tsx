import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSession } from '@/hooks'
import { PublicRoute, PrivateRoute } from '@/middlewares'
import { Login, Logout, Register } from '@/components/session'
import routes, { urls } from '@/config/routes'
import GetStarted from '@/components/GetStarted'
import Home from 'src/components/Home'
import Inbox from '@/components/Inbox'
import People from '@/components/People'
import Chatroom from '@/components/Chatroom'
import NotFound from '@/components/NotFound'

const App = () => {
  const { authenticated, logout, login } = useSession()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute authenticated={authenticated} redirectTo={urls.HOME} />}>
          <Route path={routes.LANDING} element={<GetStarted />} />
          <Route path={routes.REGISTER} element={<Register login={login} />} />
          <Route path={routes.LOGIN} element={<Login login={login} />} />
        </Route>

        <Route element={<PrivateRoute authenticated={authenticated} redirectTo={urls.LANDING} />}>
          <Route path={routes.home.INDEX} element={<Home />}>
            <Route index element={<Inbox />} />
            <Route path={routes.home.PEOPLE} element={<People />} />
            <Route path={routes.home.CHATROOM} element={<Chatroom />} />
          </Route>
          <Route path={routes.LOGOUT} element={<Logout logout={logout} />} />
        </Route>

        <Route path={routes.ANY} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
