import React, { useContext, useState, ChangeEvent, ReactElement } from 'react';
import { useUser } from 'reactfire';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import firebaseStore from '../../../common/firebaseStore';
import { AppContext } from '../AppContext';

interface IProps {
  setOpenModalUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
  openModalUserInfo: boolean;
}

export default function UserInfoModal(props: IProps): ReactElement {
  const { openModalUserInfo, setOpenModalUserInfo } = props;
  const { isRegisteredNow, setIsRegisteredNow } = useContext(AppContext);
  const { data: userData } = useUser();
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');

  const handleClose = () => {
    setOpenModalUserInfo(false);
    setIsRegisteredNow(null);
  };

  const handleSetName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSetSurname = (event: ChangeEvent<HTMLInputElement>) => {
    setSurname(event.target.value);
  };

  const addUserInfo = async () => {
    if (userData?.uid) {
      const docRef = doc(firebaseStore, `usersInfo`, userData.uid);
      const docSnap = await getDoc(docRef);

      await setDoc(docRef, {
        ...docSnap.data(),
        name,
        surname,
        uid: isRegisteredNow,
      });
    }

    handleClose();
  };

  return (
    <div>
      <Dialog open={openModalUserInfo} onClose={handleClose}>
        <DialogTitle>Please enter more information about yourself</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For more enjoyable use, provide more information about yourself and
            get more pleasure from using this service.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="name"
            fullWidth
            variant="standard"
            onChange={handleSetName}
          />
          <TextField
            margin="dense"
            id="surname"
            label="Surname"
            type="surname"
            fullWidth
            variant="standard"
            onChange={handleSetSurname}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={addUserInfo}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
