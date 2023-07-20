import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import reduxStore from '../../store/redux';
import { SessionProvider, CableProvider } from '../../providers';

type Wrapper = {
  children: React.ReactNode
}

export const SessionWrapper = ({ children }: Wrapper) => (
  <SessionProvider>
    { children }
  </SessionProvider>
)

export const CableLessWrapper = ({ children }: Wrapper) => (
  <SessionProvider>
    <Provider store={reduxStore}>
      { children }
    </Provider>
  </SessionProvider>
)

export const AppWrapper = ({ children }: Wrapper) => (
  <SessionProvider>
    <CableProvider>
      <Provider store={reduxStore}>
        { children }
      </Provider>
    </CableProvider>
  </SessionProvider>
)

export const sessionRender = (element: React.ReactElement) => render(element, {
  wrapper: SessionWrapper,
})

export const cableLessRender = (element: React.ReactElement) => render(element, {
  wrapper: CableLessWrapper,
})

export const appRender = (element: React.ReactElement) => render(element, {
  wrapper: AppWrapper,
})
