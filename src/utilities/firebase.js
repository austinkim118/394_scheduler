import { initializeApp } from 'firebase/app';
import React, { useState, useEffect } from 'react';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCnr3oUi1q-7WX_0ptmkurzsiyw9gS-b3w",
    authDomain: "cs394-sch.firebaseapp.com",
    databaseURL: "https://cs394-sch-default-rtdb.firebaseio.com",
    projectId: "cs394-sch",
    storageBucket: "cs394-sch.appspot.com",
    messagingSenderId: "705469097946",
    appId: "1:705469097946:web:ed491399102a0a8e52c2e3",
    measurementId: "G-3D394VDLEN"
  };

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

ref(database)
ref(database, '/')
ref(database, '/courses')

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

  export const setData = (path, value) => (
    set(ref(database, path), value)
  );

  export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
  };

  const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
  
    return [user];
  };