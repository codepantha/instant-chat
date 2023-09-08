'use client';

import { useRef, useState, useEffect } from 'react';
import { find } from 'lodash';

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import MessageBox from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';

interface BodyProps {
  initialMessages: FullMessageType[] | [];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prev) => {
        if (find(prev, { id: message.id })) {
          return prev;
        }

        return [...prev, message];
      });
    };

    pusherClient.bind('messages:new', messageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages?.map((message, idx) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={idx === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-24"></div>
    </div>
  );
};

export default Body;
