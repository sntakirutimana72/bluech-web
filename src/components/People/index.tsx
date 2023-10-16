import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { peopleSelector } from '@/redux/effects/peopleEffects'
import { populatePeople } from '@/redux/features/peopleSlice'
import { getActionableStatus } from '@/helpers/utils'
import { RefreshButton } from '@/components/elements/Buttons'
import { RolexWaiter } from '@/components/elements/Waiters'
import UserList from './UserList'

const People = () => {
  const {
    status,
    people,
    pagination: { current },
  } = useAppSelector(peopleSelector)
  const [page] = useState(current)
  const dispatch = useAppDispatch()

  const reloadRepository = useCallback(
    () => {
      dispatch(populatePeople(page || 1))
    },
    [],
  )

  useEffect(
    () => {
      if (status === 'idle' || (page && page !== current && status !== 'pending')) {
        reloadRepository()
      }
    },
    [page],
  )

  const [isPending, failure, ready] = getActionableStatus(status, people)

  return (
    <>
      {
        ready && <UserList users={people} />
      }
      {
        failure && <RefreshButton onClick={reloadRepository} />
      }
      {
        isPending && <RolexWaiter />
      }
    </>
  )
}

export default People
