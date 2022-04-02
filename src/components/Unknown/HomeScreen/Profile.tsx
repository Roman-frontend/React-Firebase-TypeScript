import React, { useEffect, useState, ReactElement } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore, useUser } from 'reactfire';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import MenuProfile from './MenuProfile';

interface IProps {
  openModalUserInfo: boolean;
}

const Profile = (props: IProps): ReactElement => {
  const { openModalUserInfo } = props;
  const { data: userData } = useUser();
  const firestore = useFirestore();
  const [avatar, setAvatar] = useState<string>('U');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(
    null,
  );

  useEffect(() => {
    async function getUserInfo() {
      if (userData?.uid && !openModalUserInfo) {
        const userInfo = doc(firestore, 'usersInfo', userData.uid);
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
  }, [userData, firestore, openModalUserInfo]);

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
