"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

/**
 * Firebase client SDK.
 *
 * These values are public by design — Firebase config is not a secret, access is
 * controlled by Security Rules and Auth. The private service account lives in
 * `admin.ts`, which is `server-only`.
 *
 * Everything is lazy: an unconfigured project must not crash the storefront, it
 * should simply mean accounts are unavailable.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Whether sign-in is available in this deployment. */
export function isFirebaseClientConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

const APP_NAME = 'lueur-client';

let cachedApp: FirebaseApp | null = null;

function getClientApp(): FirebaseApp {
  if (!isFirebaseClientConfigured()) {
    throw new Error('Firebase client is not configured. See .env.example.');
  }

  if (!cachedApp) {
    cachedApp = getApps().some((app) => app.name === APP_NAME)
      ? getApp(APP_NAME)
      : initializeApp(
          {
            apiKey: config.apiKey!,
            authDomain: config.authDomain!,
            projectId: config.projectId!,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId: config.appId!,
          },
          APP_NAME,
        );
  }

  return cachedApp;
}

let cachedAuth: Auth | null = null;

export function getClientAuth(): Auth {
  if (!cachedAuth) cachedAuth = getAuth(getClientApp());
  return cachedAuth;
}
