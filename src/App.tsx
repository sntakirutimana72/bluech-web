import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSession } from './hooks'
import { RedirectedRoute, PrivateRoute } from './middlewares'
import { Login, Logout, Register } from './components/Session'
import GetStarted from './components/GetStarted'
import Dashboard from './components/Dashboard'
import Inbox from './components/Inbox'
import People from './components/People'
import ChatRoom from './components/ChatRoom'
import NotFound from './components/NotFound'

const App = () => {
  const { authenticated, logout, login } = useSession()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectedRoute authenticated={authenticated} redirectTo="/dashboard" />}>
          <Route path="" element={<GetStarted />} />
          <Route path="users/register" element={<Register login={login} />} />
          <Route path="users/login" element={<Login login={login} />} />
        </Route>

        <Route element={<PrivateRoute authenticated={authenticated} redirectTo="/" />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<Inbox />} />
            <Route path="people" element={<People />} />
            <Route path="chats/:channelId" element={<ChatRoom />} />
          </Route>
          <Route path="users/logout" element={<Logout logout={logout} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
