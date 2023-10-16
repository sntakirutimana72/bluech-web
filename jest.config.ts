import type { JestConfigWithTsJest } from 'ts-jest'
// eslint-disable-next-line import/no-extraneous-dependencies
import { createJestConfig } from '@craco/craco'
import cracoConfig from './craco.config'

export default createJestConfig(cracoConfig) satisfies JestConfigWithTsJest
