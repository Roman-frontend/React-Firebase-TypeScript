import admin from 'firebase-admin';

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export default admin;
