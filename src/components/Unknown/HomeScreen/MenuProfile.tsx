import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, ListItemIcon } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import { LOGIN_ROUTE } from '../../../utils/consts';
import { AppContext } from '../AppContext';
import clearFirestoreCache from '../../../common/clearFirestoreCache';

interface IProps {
  anchorEl: null | HTMLButtonElement;
  setAnchorEl: React.Dispatch<React.SetStateAction<null | HTMLButtonElement>>;
  open: boolean;
}

const MenuProfile = (props: IProps) => {
  const navigate = useNavigate();
  const { authApp } = useContext(AppContext);
  const { anchorEl, setAnchorEl, open } = props;

  const logoutHandler = async () => {
    await signOut(authApp);
    clearFirestoreCache();
    navigate(LOGIN_ROUTE);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
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
      <MenuItem onClick={logoutHandler}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default MenuProfile;