import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDo-mzP6rvAIPZ0vR3dWW1aD0VszVwUiWo",
  authDomain: "ai-calendar-c4942.firebaseapp.com",
  projectId: "ai-calendar-c4942",
  storageBucket: "ai-calendar-c4942.firebasestorage.app",
  messagingSenderId: "543441072944",
  appId: "1:543441072944:web:2d22925bfc030fc6ce8ef5",
  measurementId: "G-R4SBSW0WE6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
// Add Google Calendar access for full calendar integration
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: any) {
    console.error('Firebase authentication error:', error);
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Firebase authentication. Please add the current domain to Firebase authorized domains.');
    }
    throw error;
  }
};

export const signOutUser = () => {
  return signOut(auth);
};

export type { User };