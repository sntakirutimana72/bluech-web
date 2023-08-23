type Props = {
  msg: CableMessage
  isSelf: boolean
}

const MessageElement = ({ msg, isSelf }: Props) => (
  <div className={`stack-${isSelf ? 'right' : 'left'}`}>
    <div className="item-container">
      <div />
      <p className="item-body">{msg.desc}</p>
      <div className="item-footer">
        <span>{msg.createdAt}</span>
        { msg.isEdited && <span className="edited">(Edited)</span> }
      </div>
    </div>
  </div>
)

export default MessageElement
