import React, { useMemo, ReactElement } from 'react';
import { useFirestore } from 'reactfire';
import {
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { Delete } from '@mui/icons-material';

interface IProps {
  id: string;
  uid: string;
  name: string;
  surname: string;
  whom: string;
  message: string;
  timestamp: FieldValue;
}

export default function Message(props: IProps): ReactElement {
  const { id, uid, name, surname, whom, message, timestamp } = props;
  const firestore = useFirestore();

  const userNameAndSurname = useMemo(() => {
    return `${name} ${surname}`;
  }, [name, surname]);

  // Дозволяє змінювати дані
  const updateMessage = async () => {
    const messageDoc = doc(firestore, 'messages', id);
    const newText = prompt('Введіть змінений текст!');
    // await updateDoc(messageDoc, { text: newText }); //Можна використовувати цей варіант замість setDoc
    setDoc(messageDoc, {
      uid,
      text: newText,
      timestamp,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteMessage = async () => {
    const messageDoc = doc(firestore, 'messages', id);
    await deleteDoc(messageDoc);
  };

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            sx={{ height: 40, width: 40 }}
            alt="Remy Sharp"
            src="/static/images/avatar/1.jpg"
          />
        </ListItemAvatar>
        <ListItemText
          primary={userNameAndSurname}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {whom || 'to everyone:'}
              </Typography>
              {`  ${message}`}
            </>
          }
        />

        <ListItemButton style={{ maxWidth: 57 }} onClick={updateMessage}>
          <EditIcon />
        </ListItemButton>
        <ListItemButton style={{ maxWidth: 57 }} onClick={deleteMessage}>
          <Delete />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
