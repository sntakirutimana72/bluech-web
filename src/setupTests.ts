import '@testing-library/jest-dom'
import LocalStorage from './specs/support/mocks/localstorage'

Object.defineProperty(window, 'localStorage', { value: LocalStorage })
