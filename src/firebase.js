// Sources
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyBFTez3JrhsgRxd2wtsh8vyvuB2s0NhwAo",
    authDomain: "elpiloncito-e43b4.firebaseapp.com",
    projectId: "elpiloncito-e43b4",
    storageBucket: "elpiloncito-e43b4.appspot.com",
    messagingSenderId: "268051442847",
    appId: "1:268051442847:web:e8b70db57932d182a286aa",
    measurementId: "G-F92QZ4QTFV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { messaging, analytics }