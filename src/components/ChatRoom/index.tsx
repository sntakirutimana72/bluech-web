import { useParams } from 'react-router-dom';
import { uid } from 'uid';
import Composer from './Composer';
import MessageElement from './MessageElement';
import { useAppSelector, useSession } from '../../hooks';
import { chatsSelector } from '../../redux/effects/chatsEffects';
import { userSelector } from '../../redux/effects/peopleEffects';

const ChatRoom = () => {
  const { currentUser } = useSession();
  const { id: partnerId } = useParams();
  const partner = useAppSelector(userSelector(partnerId!));
  const { items, isTyping } = useAppSelector(chatsSelector(partnerId!));

  return (
    <div className="chats-room">
      <nav className="chats-room-nav">
        <h2>
          Room #:
          {partnerId}
        </h2>
      </nav>

      <div className="chats-list-overlay">
        <div className="chats-list">
          { items && items.map((item) => (
            <MessageElement key={uid()} item={item} isSelf={item.author.id === currentUser!.id} />
          )) }
        </div>
      </div>

      { isTyping && (
        <div className="is-typing">{`${partner!.name} is typing..`}</div>
      ) }

      <Composer partnerId={partnerId!} currentUser={currentUser!} className="chats-room-composer" />
    </div>
  );
};
export default ChatRoom;
