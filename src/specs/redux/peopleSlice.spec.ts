import Generic from '../support/mocks/generic'
import reducer, { queryPeople } from '../../redux/features/peopleSlice'

const initialState: ReturnType<typeof reducer> = { status: 'idle', people: [] }

describe('peopleSlice', () => {
  test('[queryPeople.pending]', () => {
    const { status } = reducer(initialState, { type: queryPeople.pending.type })
    expect(status).toBe('pending')
  })

  test('[queryPeople.rejected]', () => {
    const { status } = reducer(initialState, { type: queryPeople.rejected.type })
    expect(status).toBe('failed')
  })

  test('[queryPeople.fulfilled]', () => {
    expect(initialState.people).toHaveLength(0)

    const { status, people } = reducer(initialState, {
      type: queryPeople.fulfilled.type,
      payload: [Generic.peopleObj(77)],
    })

    expect(status).toBe('loaded')
    expect(people).toHaveLength(1)
  })
})
