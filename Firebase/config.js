import { initializeApp,getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBeFOfAPI8Sds3QPTW2VG-Rgty9hLrbj58",
  authDomain: "luther-ecommerce-2e667.firebaseapp.com",
  projectId: "luther-ecommerce-2e667",
  storageBucket: "luther-ecommerce-2e667.appspot.com",
  messagingSenderId: "1055849517097",
  appId: "1:1055849517097:web:fd33cbeeb612f3d4decc38",
  
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const fireDB = getFirestore(app);




export { auth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, app , fireDB };
