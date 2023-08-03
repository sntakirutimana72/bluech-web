import { useEffect, useState } from 'react'
import { uid } from 'uid'
import { Refresh } from '@mui/icons-material'
import { LoaderOverlay } from '../Elements'
import UserElement from './UserElement'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { peopleSelector } from '../../redux/effects/peopleEffects'
import { populatePeople } from '../../redux/features/peopleSlice'

const People = () => {
  const {
    status,
    people,
    pagination: { current },
  } = useAppSelector(peopleSelector)
  const [page] = useState(current)
  const dispatch = useAppDispatch()

  const refresh = () => {
    if (['failed', 'loaded'].includes(status)) {
      dispatch(populatePeople(page || 1))
    }
  }

  useEffect(
    () => {
      if (status === 'idle') {
        dispatch(populatePeople(1))
      } else if (page && page !== current && status !== 'pending') {
        dispatch(populatePeople(page))
      }
    },
    [page],
  )

  switch (status) {
    case 'loaded':
      return (
        <div className="people-list">
          {people.map((user) => <UserElement user={user} key={uid()} />)}
        </div>
      )
    case 'failed':
      return (
        <button type="button" aria-label="Refresh" onClick={refresh}>
          <Refresh />
        </button>
      )
    default:
      return <LoaderOverlay />
  }
}

export default People
