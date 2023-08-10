import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { render } from '@testing-library/react'
import { SessionProvider, CableProvider } from '../../providers'
import reducer from '../../redux/features'

type Wrapper = {
  children: React.ReactNode
}

const initStore = () => configureStore({ reducer })

const SessionWrapper = ({ children }: Wrapper) => (
  <SessionProvider>
    { children }
  </SessionProvider>
)

const ReduxWrapper = ({ children }: Wrapper) => (
  <Provider store={initStore()}>
    { children }
  </Provider>
)

const AppWrapper = ({ children }: Wrapper) => (
  <SessionProvider>
    <CableProvider>
      <Provider store={initStore()}>
        { children }
      </Provider>
    </CableProvider>
  </SessionProvider>
)

export const sessionRender = (element: React.ReactElement) => render(element, {
  wrapper: SessionWrapper,
})

export const reduxRender = (element: React.ReactElement) => render(element, {
  wrapper: ReduxWrapper,
})

export const appRender = (element: React.ReactElement) => render(element, { wrapper: AppWrapper })
