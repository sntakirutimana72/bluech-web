import { memo } from 'react'
import { ListItemProps } from '@/components/elements/Lists'

export type ChatMessageListItemProps = ListItemProps & CableMessage

const Index = ({
  desc,
  createdAt,
  isEdited,
  isSeen,
}: ChatMessageListItemProps) => (
  <li>
    <div className="item-container">
      <p className="item-body">{desc}</p>
      <div className="item-footer">
        <span>{createdAt}</span>
        { isEdited && <span className="edited">(Edited)</span> }
        { isSeen && <span className="read">Seen</span> }
      </div>
    </div>
  </li>
)

export default memo(Index)
