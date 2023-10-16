import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import { CableProvider, SessionProvider } from './providers'
import reduxStore from './store/redux'
import App from './App'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)

root.render(
  <SessionProvider>
    <CableProvider>
      <Provider store={reduxStore}>
        <App />
      </Provider>
    </CableProvider>
  </SessionProvider>,
)

reportWebVitals()
