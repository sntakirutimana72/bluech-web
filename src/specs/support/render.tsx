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

export const appRender = (element: React.ReactElement) => render(element, { wrapper: AppWrapper })
