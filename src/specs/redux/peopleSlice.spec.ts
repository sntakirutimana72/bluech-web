import reducer, { populatePeople } from '@/redux/features/peopleSlice'
import Generic from '#test-support/mocks/generic'

describe('peopleSlice', () => {
  afterAll(() => Generic.clear())

  const initialPagy: Pagination = { current: null, pages: null }
  const initialState: ReturnType<typeof reducer> = {
    status: 'idle',
    people: [],
    pagination: initialPagy,
  }

  test('[populatePeople.pending]', () => {
    const { status } = reducer(initialState, { type: populatePeople.pending.type })
    expect(status).toBe('pending')
  })

  test('[populatePeople.rejected]', () => {
    const { status } = reducer(initialState, { type: populatePeople.rejected.type })
    expect(status).toBe('failed')
  })

  test('[populatePeople.fulfilled]', () => {
    expect(initialState.people).toHaveLength(0)

    const { status, people } = reducer(initialState, {
      type: populatePeople.fulfilled.type,
      payload: { people: [Generic.personnel()], pagination: initialPagy },
    })

    expect(status).toBe('loaded')
    expect(people).toHaveLength(1)
  })
})
