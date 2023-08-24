import { useEffect, useCallback } from 'react'
import { Refresh } from '@mui/icons-material'
import { uid } from 'uid'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { previewInbox } from '../../redux/features/inboxSlice'
import { inboxSelector } from '../../redux/effects/inboxEffects'
import { LoaderOverlay } from '../Elements'
import PreviewElement from './PreviewElement'

const Inbox = () => {
  const { status, previews } = useAppSelector(inboxSelector)
  const dispatch = useAppDispatch()

  const reloadPreviews = useCallback(
    () => {
      dispatch(previewInbox())
    },
    [],
  )

  useEffect(() => {
    if (status === 'idle') {
      reloadPreviews()
    }
  }, [status])

  switch (status) {
    case 'loaded':
      return (
        <div className="inbox-previews">
          {previews.map((inbox) => <PreviewElement inbox={inbox} key={uid()} />)}
        </div>
      )
    case 'failed':
      return (
        <button type="button" aria-label="Refresh" onClick={reloadPreviews}>
          <Refresh />
        </button>
      )
    default:
      return <LoaderOverlay />
  }
}

export default Inbox
