import Generic from '../support/mocks/generic'
import reducer, { populatePeople } from '../../redux/features/peopleSlice'

const initialPagy: Pagination = { current: null, pages: null }
const initialState: ReturnType<typeof reducer> = {
  status: 'idle',
  people: [],
  pagination: initialPagy,
}

afterEach(() => { localStorage.clear() })

describe('peopleSlice', () => {
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
      payload: { people: [Generic.personnel(77)], pagination: initialPagy },
    })

    expect(status).toBe('loaded')
    expect(people).toHaveLength(1)
  })
})
