import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './config'

export const subscribeToAuthChanges = (callback) => onAuthStateChanged(auth, callback)

export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const logOutUser = () => signOut(auth)
