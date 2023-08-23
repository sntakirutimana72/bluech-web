import { NavLink } from 'react-router-dom'
import { MarkChatUnread, Person } from '@mui/icons-material'

type Props = {
  inbox: InboxPreview
}

const PreviewElement = ({ inbox }: Props) => (
  <NavLink to={`/dashboard/chats/${inbox.id}`} className="inbox-item" title="Preview">
    <div className="inbox-avatar">
      {
        inbox.avatar
          ? <img src={inbox.avatar} alt="Avatar" />
          : <Person />
      }
    </div>

    <p className="inbox-msg-preview">{inbox.preview}</p>

    {
      inbox.unread
        ? (
          <div className="relative inbox-u-counter">
            <MarkChatUnread />
            <div>
              <span className="truncate">{inbox.unread}</span>
            </div>
          </div>
        ) : ''
      }
  </NavLink>
)

export default PreviewElement
