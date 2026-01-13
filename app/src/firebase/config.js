import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyBbyEBvRUfEYTbko-tg0-s1zXOkEeLgeB8",
  authDomain: "activity-architect-1.firebaseapp.com",
  projectId: "activity-architect-1",
  storageBucket: "activity-architect-1.firebasestorage.app",
  messagingSenderId: "397358438348",
  appId: "1:397358438348:web:c324ebc6cc1dd3fe016f69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
