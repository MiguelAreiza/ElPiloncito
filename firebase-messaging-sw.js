Sources
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBFTez3JrhsgRxd2wtsh8vyvuB2s0NhwAo",
    authDomain: "elpiloncito-e43b4.firebaseapp.com",
    projectId: "elpiloncito-e43b4",
    storageBucket: "elpiloncito-e43b4.appspot.com",
    messagingSenderId: "268051442847",
    appId: "1:268051442847:web:e8b70db57932d182a286aa",
    measurementId: "G-F92QZ4QTFV"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage(payload => {
    console.log('Recibiste un mensaje mientras no estabas',payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-180.png'
    }

    // return self.registration.showNotification(
    //     notificationTitle,
    //     notificationOptions
    // );
});