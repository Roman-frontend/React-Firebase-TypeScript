import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  FieldValue,
} from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { List, Box, Paper, Divider } from '@mui/material';
import Message from './Message';
import './Home.css';

interface IProps {
  name: string;
  surname: string;
}

// interface IMessageTest extends QueryDocumentSnapshot {
//   id: string;
//   displayName?: string;
//   text: string;
//   timestamp: FieldValue;
//   uid: string;
//   photoURL?: string;
// }

interface IMessage {
  id: string;
  displayName?: string;
  text: string;
  timestamp: FieldValue;
  uid: string;
  photoURL?: string;
}

export default function Chat(props: IProps) {
  const { name, surname } = props;
  const firestore = useFirestore();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    function unsubscribe() {
      const messagesCol = collection(firestore, 'messages');
      const q = query(messagesCol, orderBy('timestamp', 'asc'));

      onSnapshot(
        q,
        (snapshot) => {
          const b: IMessage[] = [];
          snapshot.docs.forEach((doc) => {
            const { text, timestamp, uid } = doc.data();
            if (
              typeof doc.id === 'string' &&
              typeof uid === 'string' &&
              typeof text === 'string' &&
              typeof timestamp === 'object'
            ) {
              b.push({
                id: doc.id,
                text,
                uid,
                timestamp,
              });
            }
          });
          setMessages(b);
        },
        (error) => {
          console.log('error in snapshot... ', error);
        },
      );
    }

    return unsubscribe();
  }, [firestore]);

  return (
    <Box>
      <Paper
        style={{
          background: 'white',
          height: '80vh',
          overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <List sx={{ bgcolor: 'background.paper', width: '100%' }}>
          <div className="blur" />
          <Divider />
          {Array.isArray(messages) &&
            messages.map((message: IMessage) => (
              <Message
                key={message.id}
                id={message.id}
                uid={message.uid}
                name={name}
                surname={surname}
                whom="everyone:"
                message={message.text}
                timestamp={message.timestamp}
              />
            ))}
        </List>
      </Paper>
    </Box>
  );
}
