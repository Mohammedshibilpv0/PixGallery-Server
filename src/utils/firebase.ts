
import admin from 'firebase-admin';
import * as serviceAccount from './fir-7fb9b-firebase-adminsdk-8iq0p-fafd1115d3.json';
import { FIREBASEBUCKET } from '../config/env';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: FIREBASEBUCKET,
});

const bucket = admin.storage().bucket();
export { bucket };
