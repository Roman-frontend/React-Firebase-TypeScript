import React, { useState, useCallback, ChangeEvent, ReactElement } from 'react';
import { useUser } from 'reactfire';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import firebaseStore from '../../../common/firebaseStore';
import './AddAvatar.css';

interface IProps {
  setOpenModalAddAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  openModalAddAvatar: boolean;
}

interface ILoadedFiles {
  img: string | ArrayBuffer | null | undefined;
  name: string;
  size: number;
}

// Так теж працює
// interface IValue {
//   prop: string;
// }

// interface IDynamicObject {
//   [name: string]: IValue;
// }

interface IDynamicObject {
  [name: string]: string;
}

function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / 1024 ** i)}' '${sizes[i]}`;
}

export default function AddAvatar(props: IProps): ReactElement {
  const { openModalAddAvatar, setOpenModalAddAvatar } = props;
  const { data: user } = useUser();
  const [loadedFile, setLoadedFile] = useState<ILoadedFiles[]>([]);
  const [filesForDownload, setFilesForDownload] = useState<File[]>([]);
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [loadingFile, setLoadingFile] = useState<IDynamicObject>({});
  const storage = getStorage();

  const openHandler = function () {
    const input: HTMLInputElement | null =
      document.querySelector('.input-file');
    input?.click();
  };

  const handleFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const eventFiles = event.target.files;
    setIsDownload(false);
    setLoadedFile((prev) => []);
    // event.target.files не є масивом(Array.isArray(event.target.files) === false), однак метод Array.from() дозволяє привести в масив дану конструкцію
    const files = eventFiles ? Array.from(eventFiles) : [];
    setFilesForDownload(files);
    files.forEach((file: File) => {
      // Якщо в file.type не міститься строчка 'image' бо тут ми виключно працюємо з картинками
      if (!file.type.match('image')) return;

      // Далі створюю прев'ю з об'єкту файлу
      const reader = new FileReader();

      // Цей обробник подій виконає console.log() як тільки з допомогою reader буде завершено зчитування файлу тобто в даному випадку -  виконано reader.readAsDataURL(file) то тоді виконається console.log() і тільки тоді вже безпосередньо буде зчитуватись сам файл
      // В ev.target?.result - тут закодовано те зображення що ми загрузили і дану строчку ми можемо вставити в звичайний тег img і подивитись як картинка буде виглядати
      reader.onload = (ev) => {
        console.log('ev  => ', ev.target);
        setLoadedFile((prev) =>
          prev.concat({
            img: ev.target?.result,
            name: file.name,
            size: file.size,
          }),
        );
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const handleRemoveImg = (id: string) => {
    document.getElementById(id)?.classList.add('removing');

    setTimeout(() => {
      setLoadedFile((prev) => {
        return prev.filter((file) => {
          return file.name !== id;
        });
      });
    }, 300);
  };

  function clearPreview(element: HTMLInputElement) {
    element.style.bottom = '4px';
  }

  const addImagesToUserInfo = useCallback(
    async (fileName: string, imageUrl) => {
      if (user?.uid && fileName) {
        const docRef = doc(firebaseStore, `usersInfo`, user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();

        if (
          data &&
          typeof data === 'object' &&
          data.images &&
          Array.isArray(data.images) &&
          !data.images.includes({ [fileName]: imageUrl })
        ) {
          await setDoc(docRef, {
            ...data,
            images: data.images.concat({ [fileName]: imageUrl }),
          });
        }
      }
    },
    [user],
  );

  const uploadHandler = () => {
    setIsDownload(true);
    const elems = document.querySelectorAll<HTMLInputElement>('.preview-info');
    console.log('elems => ', elems);
    elems.forEach((el) => {
      clearPreview(el);
    });
    filesForDownload.forEach((file) => {
      const avatarImagesRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(avatarImagesRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percentage = `${(
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0)}%`;
          // const block = blocks[index].querySelector('.preview-info-progress')
          // block.textContent = percentage
          // block.style.width = percentage
          setLoadingFile((prev) => ({
            ...prev,
            [file.name]: percentage,
          }));
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log(snapshot.state);
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            addImagesToUserInfo(file.name, downloadURL);
          });
        },
      );
      // Pause the upload
      // uploadTask.pause();

      // Resume the upload
      // uploadTask.resume();

      // Cancel the upload
      // uploadTask.cancel();
    });
    // loadedFile.forEach((file) => console.log('file => ', file));
  };

  const handleClose = () => {
    setOpenModalAddAvatar(false);
  };

  const createPagesPrev = useCallback(() => {
    return loadedFile.map((file) => {
      return (
        <div className="preview-image" id={file.name} key={file.name}>
          {!isDownload && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleRemoveImg(file.name)}
              onKeyDown={() => handleRemoveImg(file.name)}
              className="preview-remove"
            >
              &times;
            </div>
          )}
          {typeof file.img === 'string' && (
            <img
              style={{ width: 140, height: 'auto' }}
              alt={file.name}
              src={file.img}
            />
          )}
          <div
            className="preview-info"
            style={{
              width:
                typeof loadingFile === 'object' && loadingFile[file.name]
                  ? `${loadingFile[file.name]}`
                  : '100%',
              background: '#42b983',
            }}
          >
            <span>
              {!isDownload && file.name.length > 8
                ? `${file.name.slice(0, 9)}...`
                : file.name}
            </span>
            {isDownload ? loadingFile[file.name] : bytesToSize(file.size)}
          </div>
        </div>
      );
    });
  }, [loadedFile, isDownload, loadingFile]);

  return (
    <div>
      <Dialog maxWidth="lg" open={openModalAddAvatar} onClose={handleClose}>
        <DialogTitle>Please choose image for avatar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            For more enjoyment, please choose your avatar that your friends will
            see, recognize you and be happy to see you!
          </DialogContentText>
          <div style={{ display: 'flex', margin: 15 }}>
            <input
              className="input-file"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e)}
              type="file"
              // multiple - дозволяє загружати кілька файлів
              multiple
              // Так вказую які типи файлів будуть підтримуватись
              accept=".jpg, .jpeg, .png, .gif"
            />
            <button className="btn" type="button" onClick={openHandler}>
              Открыть
            </button>
            <button
              className="btn"
              type="button"
              style={{
                display: loadedFile[0] ? 'inline' : 'none',
                background: 'blue',
                border: 'solid 1px blue',
              }}
              onClick={uploadHandler}
            >
              Загрузить
            </button>
          </div>
          <div className="preview">
            {/* Так показуємо картинку */}
            {loadedFile && createPagesPrev()}
          </div>
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
}
