import admin from './bootstrap';
// import exampleFunction from './flat/exampleFunction';

// eslint-disable-next-line import/prefer-default-export
// export { exampleFunction };
import * as functions from 'firebase-functions';
import axios from 'axios';
// import * as admin from 'firebase-admin';

// admin.initializeApp();

export const helloWorld = functions.https.onRequest(
  (request: functions.Request, response: functions.Response): void => {
    response.send('Hello from Firebase!');
  },
);

export const api = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response) => {
    switch (req.method) {
      case 'GET':
        const response = await axios.get(
          'https://jsonplaceholder.typicode.com/users/1',
        );
        res.send(response.data);
        break;
      case 'POST':
        const body = req.body;
        res.send(body);
        break;
      case 'DELETE':
        res.send('It was DELETE request...');
        break;
      default:
        res.send('It was default request...');
    }
  },
);

exports.createdMessage = functions.firestore
  .document('/messages/{documentId}')
  .onCreate((snapshot, context) => {
    console.log(snapshot.data(), 'created...');
    return Promise.resolve();
  });

exports.deletedMessage = functions.firestore
  .document('/messages/{documentId}')
  .onDelete((snapshot, context) => {
    console.log(snapshot.data(), 'deleted...');
    return Promise.resolve();
  });

exports.updatedMessage = functions.firestore
  .document('/messages/{documentId}')
  .onUpdate((snapshot, context) => {
    console.log('Before ', snapshot.before.data());
    console.log('After', snapshot.after.data());
    return Promise.resolve();
  });

exports.sheduledFunction = functions.pubsub
  .schedule('* * * * *')
  .onRun((context) => {
    console.log('I am running/executing every minute...');
    return null;
  });

exports.newUserSignup = functions.auth.user().onCreate((user) => {
  console.log(`${user.email} is created... `);
  return admin.firestore().collection('usersInfo').doc(user.uid).set({
    email: user.email,
    createdAt: Date.now(),
  });
});

exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log(`${user.email} is deleted... `);
  const doc = admin.firestore().collection('usersInfo').doc(user.uid);
  return doc.delete();
});

exports.addRequest = functions.https.onCall((data, context) => {
  if (!context) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add requests',
    );
  }
  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'request must be more than 30 characters long',
    );
  }
  return admin.firestore().collection('requests').add({
    text: data.text,
    upvotes: 0,
  });
});
