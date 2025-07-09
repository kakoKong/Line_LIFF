// lib/firebase.js
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics'; // Make sure this import is there

// Ensure all environment variables are present and accessed correctly
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Ensure this is present in .env.local
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);

// --- Corrected Analytics Initialization ---
let analytics = null; // Initialize with null
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  // Only initialize analytics if running in the browser AND measurementId is provided
  // The 'p' error might be related to getAnalytics being called when measurementId is undefined/null
  analytics = getAnalytics(app);
}

// Export the initialized services
export { app, auth, analytics };