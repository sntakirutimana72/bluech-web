import { memo } from 'react'
import { mapUIDToList } from '@/helpers/utils'
import { List } from '@/components/elements/Lists'
import type { UserListItemProps } from './UserElement'
import UserElement from './UserElement'

type Props = { users: Personnel[] }

const UserList = ({ users }: Props) => (
  <List<UserListItemProps>
    className="people-list"
    ListItem={UserElement}
    list={mapUIDToList<Personnel, UserListItemProps>('usr-', users)}
  />
)

export default memo(UserList)
