import React, { ReactElement, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { useFirestore, useAuth } from 'reactfire';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, ListItemIcon } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteSweep from '@mui/icons-material/DeleteSweep';
import Logout from '@mui/icons-material/Logout';
import { LOGIN_ROUTE } from '../../../utils/consts';
import clearFirestoreCache from '../../../common/clearFirestoreCache';
import AddAvatar from './AddAvatar';
import ModalListImages from './ModalListImages';

interface IProps {
  anchorEl: null | HTMLButtonElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLButtonElement>>;
  open: boolean;
}

const MenuProfile = (props: IProps): ReactElement => {
  const navigate = useNavigate();
  const authApp = useAuth();
  const { anchorEl, setAnchorEl, open } = props;
  const firestore = useFirestore();
  const [openModalAddAvatar, setOpenModalAddAvatar] = useState<boolean>(false);
  const [openModalListImages, setOpenModalListImages] =
    useState<boolean>(false);
  const messagesCol = collection(firestore, 'messages');

  const addAvatarHandle = () => {
    setOpenModalAddAvatar(true);
  };

  const openListImageHandle = () => {
    setOpenModalListImages(true);
  };

  const logoutHandler = async () => {
    await signOut(authApp);
    clearFirestoreCache();
    navigate(LOGIN_ROUTE);
  };

  // Видаляє кілька повідомлень
  const handleQueryDelete = async () => {
    const promptText = prompt(
      'Enter text for delete all messages with the text',
      ' ',
    );
    const q = query(messagesCol, where('text', '==', promptText), limit(2));
    const snapshot = await getDocs(q);

    const results = snapshot.docs.map((snap) => ({
      ...snap.data(),
      id: snap.id,
    }));

    results.forEach(async (result) => {
      const docRef = doc(firestore, 'messages', result.id);
      await deleteDoc(docRef);
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={addAvatarHandle}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Add avatar
        </MenuItem>
        <MenuItem onClick={openListImageHandle}>
          <ListItemIcon>
            <FormatListBulletedIcon fontSize="small" />
          </ListItemIcon>
          List of images
        </MenuItem>
        <MenuItem onClick={handleQueryDelete}>
          <ListItemIcon>
            <DeleteSweep fontSize="small" />
          </ListItemIcon>
          Delete some messages
        </MenuItem>
        <MenuItem onClick={logoutHandler}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <AddAvatar
        openModalAddAvatar={openModalAddAvatar}
        setOpenModalAddAvatar={setOpenModalAddAvatar}
      />
      <ModalListImages
        openModalListImages={openModalListImages}
        setOpenModalListImages={setOpenModalListImages}
      />
    </>
  );
};

export default MenuProfile;
