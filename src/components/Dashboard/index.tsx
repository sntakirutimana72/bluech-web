import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Unsubscribe } from 'nanoevents';
import {
  useAppDispatch,
  useAppSelector,
  useSession,
  useCable,
} from '../../hooks';
import { ChatsChannel } from '../../channels';
import type { ChatMessage, TypingMessage } from '../../channels';
import { statusesSelector } from '../../redux/effects/appEffects';
import { queryPeople } from '../../redux/features/peopleSlice';
import { previewInbox } from '../../redux/features/inboxSlice';
import { mapMessage, userTyping } from '../../redux/features/chatsSlice';
import { TopNav, BottomNav } from './Navs';
import { LoaderOverlay } from '../Elements';

const Dashboard = () => {
  const [ready, setReady] = useState(false);
  const { currentUser } = useSession();
  const { cable } = useCable();
  const { inboxStatus, peopleStatus } = useAppSelector(statusesSelector);
  const dispatch = useAppDispatch();

  const handleTyping = (msg: TypingMessage) => {
    const { author } = msg;
    userTyping(author.id);
  };
  const handleMessage = (msg: ChatMessage) => {
    const { message } = msg;
    mapMessage(message);
  };

  useEffect(
    () => {
      const readiness: ThunkStatus[] = ['failed', 'loaded'];
      let unbinders: Unsubscribe[];
      let channel: ChatsChannel;

      if (!ready && inboxStatus === 'idle' && peopleStatus === 'idle') {
        dispatch(queryPeople(1));
        dispatch(previewInbox());
      } else if (
        !ready
        && readiness.includes(inboxStatus)
        && readiness.includes(peopleStatus)
      ) {
        if (cable) {
          const { id, name } = currentUser!;
          channel = cable.subscribe(new ChatsChannel({ id, name }));
          unbinders = [
            channel.on('typing', handleTyping),
            channel.on('message', handleMessage),
            channel.on('close', () => {}),
            channel.on('disconnect', () => {}),
          ];
        }
        setReady(true);
      }
      return () => {
        if (channel) {
          unbinders.forEach((cb) => { cb(); });
          channel.leave();
        }
      };
    },
    [
      ready,
      inboxStatus,
      peopleStatus,
      cable,
      currentUser,
      dispatch,
    ],
  )

  return ready ? (
    <div className="dashboard">
      <TopNav currentUser={currentUser as CurrentUser} />
      <div className="views-manager">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  ) : <LoaderOverlay />
}

export default Dashboard
