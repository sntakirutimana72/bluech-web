type Props = {
  item: CableMessage
  isSelf: boolean
}

const MessageElement = ({ item, isSelf }: Props) => (
  <div className={`stack-${isSelf ? 'right' : 'left'}`}>
    <div className="item-container">
      <div />
      <div className="item-body">{item.desc}</div>
      <div className="item-footer">
        <span>{item.creation_date.toString()}</span>
        { item.is_edited && <span className="edited">(Edited)</span> }
      </div>
    </div>
  </div>
)

export default MessageElement
