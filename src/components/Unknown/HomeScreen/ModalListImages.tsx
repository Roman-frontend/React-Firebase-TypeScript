import React, {
  useState,
  ReactElement,
  useEffect,
  useCallback,
  memo,
} from 'react';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc, DocumentData } from 'firebase/firestore';
import { useUser } from 'reactfire';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import firebaseStore from '../../../common/firebaseStore';
import './AddAvatar.css';

interface IProps {
  setOpenModalListImages: React.Dispatch<React.SetStateAction<boolean>>;
  openModalListImages: boolean;
}

interface IDocImage {
  [name: string]: string;
}

const ModalListImages = memo((props: IProps): ReactElement => {
  const { openModalListImages, setOpenModalListImages } = props;
  const { data: user } = useUser();
  const [userInfo, setUserInfo] = useState<DocumentData | null>(null);

  // Create a reference to the file we want to download
  const storage = getStorage();

  useEffect(() => {
    (async function () {
      if (user?.uid) {
        const docRef = doc(firebaseStore, `usersInfo`, user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data && typeof data === 'object' && Array.isArray(data.images)) {
          setUserInfo(data);
        }
      }
    })();

    return () => {
      setUserInfo(null);
    };
  }, [user]);

  const createUrlName = useCallback((rowUrl: string) => {
    if (typeof rowUrl === 'string') {
      const matchedUrl = rowUrl.match(/(%[1-9A-Za-z])"?\w+/g);
      const url = Array.isArray(matchedUrl) && matchedUrl[0];
      if (typeof url === 'string') {
        const imageName =
          url.length > 18 ? `${url.slice(3, 21)}...` : url.slice(3);
        return imageName;
      }
    }
    return '';
  }, []);

  const handleClose = () => {
    setOpenModalListImages(false);
  };

  const removeImageFromFirestorage = useCallback(
    (imgName) => {
      const imageRef = ref(storage, `images/${imgName}`);
      deleteObject(imageRef)
        .then(() => {
          console.log('File deleted successfully frome firestorage');
        })
        .catch((error) => {
          console.log('Uh-oh, an error occurred! ', error);
        });
    },
    [storage],
  );

  const removeImageFromFirestore = useCallback(
    (imgName) => {
      if (user) {
        const docRef = doc(firebaseStore, `usersInfo`, user.uid);
        getDoc(docRef).then((docSnap: DocumentData) => {
          const data = docSnap.data();
          if (
            docSnap &&
            typeof docSnap === 'object' &&
            Array.isArray(data.images)
          ) {
            setDoc(docRef, {
              ...data,
              images: data.images.filter(
                (img: IDocImage) => Object.keys(img)[0] !== imgName,
              ),
            }).finally(() => {
              console.log('removed image from firestore');
            });
          }
        });
      }
    },
    [user],
  );

  const handleRemoveImg = useCallback(
    (id: string, imgName: string) => {
      try {
        removeImageFromFirestorage(imgName);
        removeImageFromFirestore(imgName);
        document.getElementById(id)?.classList.add('removing');
      } catch (error) {
        console.log('error in handleRemoveImg => ', error);
      }
    },
    [removeImageFromFirestorage, removeImageFromFirestore],
  );

  const createImages = useCallback(() => {
    if (
      userInfo &&
      typeof userInfo === 'object' &&
      Array.isArray(userInfo.images)
    ) {
      return userInfo.images.map((imgObj) => {
        const imgUrl = Object.values(imgObj)[0];
        const imgName = Object.keys(imgObj)[0];
        if (typeof imgUrl === 'string') {
          const name = createUrlName(imgUrl);
          return (
            <div className="preview-image" id={name} key={name}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleRemoveImg(name, imgName)}
                onKeyDown={() => handleRemoveImg(name, imgName)}
                className="preview-remove"
              >
                &times;
              </div>
              <img
                style={{ width: 140, height: 'auto' }}
                alt={name}
                src={imgUrl}
              />
              <a href={imgUrl} style={{ textAlign: 'center' }}>
                {name}
              </a>
            </div>
          );
        }

        return null;
      });
    }

    return null;
  }, [userInfo, handleRemoveImg, createUrlName]);

  return (
    <div>
      <Dialog maxWidth="lg" open={openModalListImages} onClose={handleClose}>
        <DialogTitle>Please choose image for avatar</DialogTitle>
        <DialogContent>
          <div className="preview">{createImages()}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={() => console.log('CLICKED DONE')}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default ModalListImages;
