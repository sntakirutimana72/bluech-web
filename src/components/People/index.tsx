import { useEffect, useState } from 'react'
import { uid } from 'uid'
import { Refresh } from '@mui/icons-material'
import { LoaderOverlay } from '../Elements'
import UserElement from './UserElement'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { peopleSelector } from '../../redux/effects/peopleEffects'
import { queryPeople } from '../../redux/features/peopleSlice'

const People = () => {
  const [page] = useState(1)
  const { status, people } = useAppSelector(peopleSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === 'idle') {
      dispatch(queryPeople(page))
    }
  }, [status, page, dispatch])

  switch (status) {
    case 'loaded':
      return (
        <div className="people-list">
          {people.map((user) => <UserElement user={user} key={uid()} />)}
        </div>
      )
    case 'failed':
      return <button type="button" aria-label="Refresh"><Refresh /></button>
    default:
      return <LoaderOverlay />
  }
}

export default People
