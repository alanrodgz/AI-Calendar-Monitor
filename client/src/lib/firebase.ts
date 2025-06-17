import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut, User } from "firebase/auth";

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

export const signInWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

export const signOutUser = () => {
  return signOut(auth);
};

export type { User };