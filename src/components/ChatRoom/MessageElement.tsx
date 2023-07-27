type Props = {
  msg: CableMessage
  isSelf: boolean
}

const MessageElement = ({ msg, isSelf }: Props) => (
  <div className={`stack-${isSelf ? 'right' : 'left'}`}>
    <div className="item-container">
      <div />
      <div className="item-body">{msg.desc}</div>
      <div className="item-footer">
        <span>{msg.creation_date.toString()}</span>
        { msg.is_edited && <span className="edited">(Edited)</span> }
      </div>
    </div>
  </div>
)

export default MessageElement
