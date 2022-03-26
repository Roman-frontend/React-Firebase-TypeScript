import React, { useContext, useEffect, useState, ReactElement } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from 'reactfire';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { AppContext } from '../AppContext';
import MenuProfile from './MenuProfile';

const Profile: React.FC = (): ReactElement => {
  const { data: userData } = useUser();
  const { firestoreApp } = useContext(AppContext);
  const [avatar, setAvatar] = useState<string>('U');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null,
  );

  useEffect(() => {
    async function getUserInfo() {
      if (userData?.uid) {
        const userInfo = doc(firestoreApp, 'infoUsers', userData?.uid);
        const docSnap = await getDoc(userInfo);
        const user = docSnap.data();
        if (typeof user === 'object' && 'name' in user && 'surname' in user) {
          const name = user.name.charAt(0);
          const surname = user.surname.charAt(0);
          const result = [name, surname].join('');
          setAvatar(result);
        }
      }
    }

    getUserInfo();
  }, [userData, firestoreApp]);

  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleClick(event)
          }
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{avatar}</Avatar>
        </IconButton>
      </Tooltip>
      <MenuProfile anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open} />
    </>
  );
};

export default Profile;
