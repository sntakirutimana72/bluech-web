import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { MarkChatUnread, Person } from '@mui/icons-material'
import { urls } from '@/config/routes'
import { ListItemProps } from '@/components/elements/Lists'

export type PreviewListItemProps = ListItemProps & InboxPreview

const PreviewElement = ({
  id,
  preview,
  avatar,
  unread,
}: PreviewListItemProps) => (
  <li title="Preview">
    <NavLink to={urls.chatroom(id)} className="inbox-item" title={`Preview-${id}`}>
      <div className="inbox-avatar">
        {
          avatar ? <img src={avatar} alt="Avatar" /> : <Person />
        }
      </div>
      <p className="inbox-msg-preview">{preview}</p>
      {
        unread
          ? (
            <div className="relative inbox-u-counter">
              <MarkChatUnread />
              <div>
                <span className="truncate">{unread}</span>
              </div>
            </div>
          ) : ''
      }
    </NavLink>
  </li>
)

export default memo(PreviewElement)
