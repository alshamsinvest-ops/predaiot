"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

/**
 * Firebase client config is injected via NEXT_PUBLIC_* env vars.
 * (NEXT_PUBLIC_FIREBASE_CONFIG can also hold the full JSON blob.)
 */
function readConfig() {
  const raw = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* fall through to individual vars */
    }
  }
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

let app: FirebaseApp | null = null;

/** True when Firebase web config is present (so auth UI can degrade gracefully). */
export function isFirebaseConfigured(): boolean {
  return !!readConfig().apiKey;
}

export function getFirebaseApp(): FirebaseApp | null {
  const config = readConfig();
  if (!config.apiKey) return null; // not configured yet — UI degrades gracefully
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function getFirebaseAuth() {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Authentication is not configured yet.");
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Authentication is not configured yet.");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Authentication is not configured yet.");
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  const auth = getFirebaseAuth();
  if (auth) await fbSignOut(auth);
}

export { onAuthStateChanged };
export type { User };
