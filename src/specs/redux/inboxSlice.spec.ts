import reducer, {
  incrementUCounter,
  resetUCounter,
  clearCounter,
  previewInbox,
} from '@/redux/features/inboxSlice'
import { now } from '@/helpers/utils'
import Generic from '#test-support/mocks/generic'

describe('inboxSlice', () => {
  afterAll(() => Generic.clear())

  const initialState: ReturnType<typeof reducer> = { status: 'idle', previews: [] }

  test('incrementUCounter', () => {
    const state = { ...initialState }
    const { id, preview } = Generic.inboxPreview()
    const createdAt = now().toISOString()
    const { previews } = reducer(state, incrementUCounter({ id, preview, createdAt }))

    expect(previews).toEqual([{
      id, preview, unread: 1, createdAt,
    }])
  })

  test('resetUCounter', () => {
    const inboxPreview = Generic.inboxPreview()
    ++inboxPreview.unread
    const state = { ...initialState }

    expect(inboxPreview.unread).not.toBe(0)

    state.previews = [inboxPreview]
    const createdAt = now().toISOString()
    const { id, preview } = inboxPreview
    const { previews } = reducer(state, resetUCounter({ id, preview, createdAt }))

    expect(previews).toEqual([{
      id, preview, unread: 0, createdAt,
    }])
  })

  test('clearCounter', () => {
    const inboxPreview = Generic.inboxPreview()
    ++inboxPreview.unread
    const state = { ...initialState }

    expect(inboxPreview.unread).not.toBe(0)

    state.previews = [inboxPreview]
    const { previews } = reducer(state, clearCounter(inboxPreview.id))

    expect(previews).toEqual([{ ...inboxPreview, unread: 0 }])
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
