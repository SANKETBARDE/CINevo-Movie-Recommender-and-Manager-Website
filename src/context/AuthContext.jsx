import { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc, deleteField, deleteDoc, setDoc, query, collection, where, getDocs } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user document already exists by email before creating a new one
    try {
      const q = query(collection(db, 'users'), where('email', '==', result.user.email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log("No existing user document found, creating new one");
        // Create user document if it doesn't exist with all necessary fields
        const userRef = doc(db, 'users', result.user.uid);
        await setDoc(userRef, {
          username: result.user.displayName || 'Cinephile',
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isProfileComplete: false,
          favoriteGenres: [],
          wishlist: [],
          bio: ''
        }, { merge: true });
      } else {
        console.log("Existing user document found, using it instead of creating new one");
        // Update the existing document with latest auth info
        const existingDoc = querySnapshot.docs[0];
        await setDoc(doc(db, 'users', existingDoc.id), {
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          uid: result.user.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error checking for existing user document:", error);
      // Fallback: try to create document anyway
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(userRef, {
        username: result.user.displayName || 'Cinephile',
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isProfileComplete: false,
        favoriteGenres: [],
        wishlist: [],
        bio: ''
      }, { merge: true });
    }
    
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.email);
      console.log("Auth user UID:", currentUser?.uid);
      setUser(currentUser);
      
      if (currentUser) {
        // Set loading to false immediately - app can load while profile fetches in background
        setLoading(false);
        
        // Listen to the user's profile document in Firestore (background fetch)
        const userDocRef = doc(db, 'users', currentUser.uid);
        console.log("Setting up Firestore listener for user:", currentUser.uid);
        console.log("Firestore document path:", userDocRef.path);
        
        unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
            console.log("Firestore snapshot received, exists:", docSnap.exists());
            console.log("Document ID:", docSnap.id);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("User profile data loaded:", data);
                console.log("Wishlist:", data.wishlist);
                console.log("Favorite genres:", data.favoriteGenres);
                
                if (data.scheduledDeletionDate) {
                    const now = Date.now();
                    if (now > data.scheduledDeletionDate) {
                        // 30 days have passed. Execute deletion.
                        try {
                            await deleteDoc(userDocRef);
                            await currentUser.delete();
                            setUserProfile(null);
                            return;
                        } catch (e) {
                            console.error("Failed to delete user account, forcing logout", e);
                            signOut(auth);
                            return;
                        }
                    } else {
                        // Account is scheduled for deletion. Check if user just logged in.
                        const lastSignInTime = new Date(currentUser.metadata.lastSignInTime).getTime();
                        const deletionRequestedAt = data.scheduledDeletionDate - (30 * 24 * 60 * 60 * 1000);
                        
                        // If they signed in AFTER they requested deletion, cancel the deletion.
                        if (lastSignInTime > deletionRequestedAt) {
                            try {
                                await updateDoc(userDocRef, {
                                    scheduledDeletionDate: deleteField()
                                });
                                // Note: The snapshot listener will fire again with the updated data
                            } catch (e) {
                                console.error("Failed to cancel deletion", e);
                            }
                        }
                    }
                }
                
                setUserProfile(data);
            } else {
                console.log("Document not found by UID, trying to find by email...");
                // Fallback: try to find user document by email
                try {
                    const q = query(collection(db, 'users'), where('email', '==', currentUser.email));
                    const querySnapshot = await getDocs(q);
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        console.log("Found user document by email:", userDoc.id);
                        console.log("User data:", userDoc.data());
                        setUserProfile(userDoc.data());
                        // Switch to listening to the correct document
                        if (unsubscribeSnapshot) unsubscribeSnapshot();
                        unsubscribeSnapshot = onSnapshot(doc(db, 'users', userDoc.id), (snap) => {
                            if (snap.exists()) {
                                const userData = snap.data();
                                console.log("Updated user data from email-based lookup:", userData);
                                setUserProfile(userData);
                            }
                        });
                    } else {
                        console.log("No user document found by email either");
                        setUserProfile(null);
                    }
                } catch (error) {
                    console.error("Error finding user by email:", error);
                }
            }
        }, (error) => {
            console.error("Error fetching user profile:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
        });
      } else {
        console.log("User logged out");
        setUserProfile(null);
        setLoading(false);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const value = {
    user,
    userProfile,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
