import Generic from '../support/mocks/generic'
import reducer, {
  incrementUCounter,
  resetUCounter,
  previewInbox,
} from '../../redux/features/inboxSlice'

const initialState: ReturnType<typeof reducer> = { status: 'idle', previews: [] }

afterEach(() => { localStorage.clear() })
afterAll(() => { Generic.resetAll() })

describe('inboxSlice', () => {
  test('incrementUCounter', () => {
    const state = { ...initialState }
    const { id, preview } = Generic.inboxPreview()
    const { previews } = reducer(state, incrementUCounter({ id, preview }))

    expect(previews).toEqual([
      {
        id, preview, unread: 1, createdAt: previews[0].createdAt,
      },
    ])
  })

  test('resetUCounter', () => {
    const inboxPreview = Generic.inboxPreview()
    ++inboxPreview.unread
    const state = { ...initialState }
    expect(inboxPreview.unread).not.toBe(0)
    state.previews = [inboxPreview]
    const { id, preview } = inboxPreview
    const { previews } = reducer(state, resetUCounter({ id, preview }))

    expect(previews).toEqual([
      {
        id, preview, unread: 0, createdAt: previews[0].createdAt,
      },
    ])
  })

  test('[previewInbox.pending]', () => {
    expect(initialState.status).toBe('idle')
    const { status } = reducer(initialState, { type: previewInbox.pending.type })
    expect(status).toBe('pending')
  })

  test('[previewInbox.rejected]', () => {
    expect(initialState.status).toBe('idle')
    const { status } = reducer(initialState, { type: previewInbox.rejected.type })
    expect(status).toBe('failed')
  })

  test('[previewInbox.fulfilled]', () => {
    expect(initialState.status).toBe('idle')
    expect(initialState.previews).toHaveLength(0)

    const { status, previews } = reducer(initialState, {
      type: previewInbox.fulfilled.type,
      payload: [Generic.inboxPreview()],
    })

    expect(status).toBe('loaded')
    expect(previews).toHaveLength(1)
  })
})
