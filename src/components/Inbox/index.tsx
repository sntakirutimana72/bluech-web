import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { previewInbox } from '@/redux/features/inboxSlice'
import { inboxSelector } from '@/redux/effects/inboxEffects'
import { getActionableStatus } from '@/helpers/utils'
import { RefreshButton } from '@/components/elements/Buttons'
import { RolexWaiter } from '@/components/elements/Waiters'
import PreviewList from './PreviewList'

const Inbox = () => {
  const { status, previews } = useAppSelector(inboxSelector)
  const dispatch = useAppDispatch()

  const reloadPreviews = useCallback(() => { dispatch(previewInbox()) }, [])

  useEffect(() => {
    if (status === 'idle') {
      reloadPreviews()
    }
  }, [status])

  const [isPending, failure, ready] = getActionableStatus(status, previews)

  return (
    <>
      {
        ready && <PreviewList previews={previews} />
      }
      {
        failure && <RefreshButton onClick={reloadPreviews} />
      }
      {
        isPending && <RolexWaiter />
      }
    </>
  )
}

export default Inbox
