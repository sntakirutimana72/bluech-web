import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import reduxStore from '../../store/redux';
import { SessionProvider, CableProvider } from '../../providers';

type WrapperProps = { children: React.ReactNode }

export const ReduxWrapper = ({ children }: WrapperProps) => (
  <Provider store={reduxStore}>
    { children }
  </Provider>
)

export const CableLessWrapper = ({ children }: WrapperProps) => (
  <SessionProvider>
    <Provider store={reduxStore}>
      { children }
    </Provider>
  </SessionProvider>
)

export const AppWrapper = ({ children }: WrapperProps) => (
  <SessionProvider>
    <CableProvider>
      <Provider store={reduxStore}>
        { children }
      </Provider>
    </CableProvider>
  </SessionProvider>
)

export const reduxRender = (element: React.ReactElement) => render(element, {
  wrapper: ReduxWrapper,
})

export const cableLessRender = (element: React.ReactElement) => render(element, {
  wrapper: CableLessWrapper,
})

export const appRender = (element: React.ReactElement) => render(element, {
  wrapper: AppWrapper,
})
