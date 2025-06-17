import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // The signed-in user info is already handled by onAuthStateChanged
        }
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}