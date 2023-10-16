import { isInit } from '@/helpers/utils'

test('isInit( obj )', () => {
  expect(isInit(null)).toBeTruthy()
  expect(isInit(undefined)).toBeFalsy()
})
