import Store from '../../store/session'

afterAll(() => {
  localStorage.clear()
})

describe('SessionStore', () => {
  const value = 'SOME_AUH_X_AUTH_VALUE'

  test('&:persist &:fetch', () => {
    expect(Store.fetch()).toBeNull()
    Store.persist(value)
    expect(Store.fetch()).toBe(value)
  })

  test('&:destroy', () => {
    Store.persist(value)
    expect(Store.fetch()).not.toBeNull()
    Store.destroy()
    expect(Store.fetch()).toBeNull()
  })
})
