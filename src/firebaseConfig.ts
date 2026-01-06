// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB96UgzWa71TqNN9CzOoTCvS4JeSskTT4o",
    authDomain: "bajau-personal.firebaseapp.com",
    projectId: "bajau-personal",
    storageBucket: "bajau-personal.firebasestorage.app",
    messagingSenderId: "341286129560",
    appId: "1:341286129560:web:03c6434ebf4be497e025ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const storage = getStorage(app);
