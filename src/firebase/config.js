import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD4FAZhMStMrqNhX3ZpHxsVmph21Ggamts",
  authDomain: "quitter-614a5.firebaseapp.com",
  projectId: "quitter-614a5",
  storageBucket: "quitter-614a5.firebasestorage.app",
  messagingSenderId: "403092958220",
  appId: "1:403092958220:web:5ee213b4b73ee8822c9229",
  measurementId: "G-GEMSJETJLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export initialized instances
export { auth, db, analytics }; 