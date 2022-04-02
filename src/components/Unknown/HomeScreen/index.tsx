import React, { useContext, ReactElement } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Profile from './Profile';
import UserInfoModal from './UserInfoModal';
import { AppContext } from '../AppContext';

const HomeScreen: React.FC = (): ReactElement => {
  const { isRegisteredNow } = useContext(AppContext);
  const [openModalUserInfo, setOpenModalUserInfo] =
    React.useState<boolean>(isRegisteredNow);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar style={{ background: 'red' }} position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Voypost
            </Typography>
            <Profile openModalUserInfo={openModalUserInfo} />
          </Toolbar>
        </AppBar>
      </Box>
      <Box>
        <UserInfoModal
          openModalUserInfo={openModalUserInfo}
          setOpenModalUserInfo={setOpenModalUserInfo}
        />
      </Box>
    </>
  );
};

export default HomeScreen;
