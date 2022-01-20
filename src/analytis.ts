// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyA90HdY_e5A7W-XNp2ihCyuQ37o8HwY4sc',
    authDomain: 'chinese-colors.heyfe.org',
    projectId: 'china-color-web-design',
    storageBucket: 'china-color-web-design.appspot.com',
    messagingSenderId: '227815443880',
    appId: '1:227815443880:web:ee9644d41501117fdaa19d',
    measurementId: 'G-8JJSFKSWJK'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default analytics;
