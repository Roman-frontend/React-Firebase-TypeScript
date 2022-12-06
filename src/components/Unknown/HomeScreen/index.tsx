import React, {
  useState,
  ReactElement,
  useEffect,
  useRef,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { useFirestore, useUser } from 'reactfire';
import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  doc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Profile from './Profile';
import Chat from './Chat';
import Loader from '../Loader/Loader';
import Menu from './Menu/Menu';
import menuItems from './menuItems';
import './Home.css';

// interface IUserInfo extends DocumentData {
//   name: string;
//   surname: string;
//   uid: string;
// }

const HomeScreen: React.FC = (): ReactElement => {
  const { data: userData } = useUser();
  const firestore = useFirestore();
  const [userInfo, setUserInfo] = useState<DocumentData>({
    name: '',
    surname: '',
    uid: '',
  });
  const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(true);
  const [menuActive, setMenuActive] = useState<boolean>(false);
  // <div> reference type
  // const divRef = React.useRef<HTMLDivElement>(null);

  // <button> reference type
  // const buttonRef = React.useRef<HTMLButtonElement>(null);

  // <br /> reference type
  // const brRef = React.useRef<HTMLBRElement>(null);

  // <a> reference type
  // const linkRef = React.useRef<HTMLLinkElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesCol = collection(firestore, 'messages');

  useEffect(() => {
    async function getUserInfo() {
      if (userData?.uid) {
        const usersInfoDocs = doc(firestore, 'usersInfo', userData.uid);
        const userDoc = await getDoc(usersInfoDocs);
        const user = userDoc.data();

        if (typeof user === 'object' && 'name' in user && 'surname' in user) {
          setUserInfo(user);
        }
      }
      setLoadingUserInfo(false);
    }

    getUserInfo();
  }, [userData, firestore]);

  const sendMessage = async (event: KeyboardEvent<HTMLInputElement>) => {
    const text = inputRef?.current?.value || '';
    event.preventDefault();
    if (event.key === 'Enter' && inputRef.current) {
      await addDoc(messagesCol, {
        uid: userInfo.uid,
        // displayName: user.displayName,
        // photoURL: user.photoURL,
        text,
        timestamp: serverTimestamp(),
      });

      // Код нижче не перевірений але списаний
      // const addRequest = firebase.functions().httpsCallable('addRequest');
      // addRequest({
      //   text: requestForm.request.value
      // })
      // .then(() => {
      //   requestForm.reset();
      //   requestForm.querySelector('.error').textContent = '';
      //   requestModal.classList.remove('open');
      // })
      // .catch(error => {
      //   requestForm.querySelector('.error').textContent = error.message;
      // });

      if (inputRef?.current?.value) inputRef.current.value = '';
    }
  };

  function menuBtnHandler(
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) {
    e.stopPropagation();
    setMenuActive(!menuActive);
  }

  // console.log('loadingUserInfo => ', loadingUserInfo);

  if (loadingUserInfo) {
    return <Loader />;
  }

  console.log(menuActive);

  return (
    <Box
      style={{
        background: 'lightyellow',
        height: '100%',
        width: '100%',
      }}
      onClick={() => setMenuActive(false)}
    >
      {/* Розмиватиме зміст сторінки на якій ми знаходимось  */}
      <Box sx={{ width: 800, margin: 'auto', position: 'relative' }}>
        <Menu
          header="Бургер меню"
          items={menuItems}
          menuActive={menuActive}
          setMenuActive={setMenuActive}
        />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar style={{ background: 'red', height: 65 }} position="static">
            <Toolbar>
              <div
                className="menu__btn"
                role="button"
                tabIndex={0}
                onClick={(e) => menuBtnHandler(e)}
                onKeyDown={(e) => menuBtnHandler(e)}
              >
                <span />
              </div>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Voypost
              </Typography>
              <Profile />
            </Toolbar>
          </AppBar>
        </Box>
        <Chat name={userInfo.name} surname={userInfo.surname} />

        <TextField
          fullWidth
          style={{ background: 'white' }}
          variant="outlined"
          inputRef={inputRef}
          onKeyUp={(event: KeyboardEvent<HTMLInputElement>) =>
            sendMessage(event)
          }
        />
      </Box>
    </Box>
  );
};

export default HomeScreen;
