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

  const reloadRepository = () => {
    dispatch(populatePeople(page || 1))
  }

  useEffect(
    () => {
      if (status === 'idle' || (page && page !== current && status !== 'pending')) {
        reloadRepository()
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
        <button type="button" aria-label="Refresh" onClick={reloadRepository}>
          <Refresh />
        </button>
      )
    default:
      return <LoaderOverlay />
  }
}

export default People
