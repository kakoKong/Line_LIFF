// pages/_app.js
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { auth } from '../lib/firebase'; // Import Firebase auth

function MyApp({ Component, pageProps }) {
  const [liffError, setLiffError] = useState(null);
  const [liffProfile, setLiffProfile] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID; // Your LIFF ID from .env.local

  useEffect(() => {
    // 1. Initialize LIFF
    const initLiff = async () => {
      try {
        await liff.init({ liffId });
        console.log("LIFF initialized successfully");

        // 2. LINE Login (if not already logged in)
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setLiffProfile(profile);
          console.log("LINE Profile:", profile);

          // 3. Firebase Custom Token Authentication (Backend Integration)
          // This part relies on your FastAPI backend to generate a custom token.
          // For a minimal example, we'll just show the LINE profile.
          // In a real app, you'd send `profile.userId` to your backend,
          // backend generates a Firebase custom token, sends it back,
          // and then you sign in Firebase with `signInWithCustomToken`.
          // For now, let's keep it simple: just show LIFF profile is enough for MVP UI.

          // Example of Firebase auth (if using Firebase Auth directly, not custom tokens from backend for LINE)
          // Note: For LIFF, it's common to use LINE's user ID to link to Firebase,
          // often via a custom token generated on your server.
          // For a truly minimal setup, we might skip direct Firebase Auth on client for LINE Login
          // and just use the LINE profile from liff.getProfile().
        }
      } catch (error) {
        setLiffError(error.toString());
        console.error("LIFF init or login failed", error);
      }
    };

    if (liffId) {
      initLiff();
    } else {
      setLiffError("LIFF ID is not set. Please set NEXT_PUBLIC_LIFF_ID in .env.local");
    }

    // Optional: Firebase Auth Listener (if using other Firebase auth methods like Email/Password for dev)
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   setFirebaseUser(user);
    // });
    // return () => unsubscribe();

  }, [liffId]);

  if (liffError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>LIFF Initialization Error</h1>
        <p>{liffError}</p>
        <p>Please ensure your LIFF ID is correctly set and the app is accessed via LINE.</p>
      </div>
    );
  }

  return (
    <Component {...pageProps} liffProfile={liffProfile} firebaseUser={firebaseUser} />
  );
}

export default MyApp;