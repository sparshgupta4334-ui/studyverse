'use strict';

const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    logger.warn('Firebase credentials missing – OTP verification will be unavailable');
    return null;
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // Newlines are escaped in env vars; restore them
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });

  logger.info('Firebase Admin SDK initialized');
  return firebaseApp;
};

const getFirebaseAdmin = () => {
  if (!firebaseApp) initFirebase();
  return admin;
};

module.exports = { initFirebase, getFirebaseAdmin };
