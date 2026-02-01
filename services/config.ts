// Firebase initialization using NEXT_PUBLIC_ environment variables
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// These values are read from .env.local (NEXT_PUBLIC_ prefix so they are available client-side)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate critical env variables early to catch configuration issues during development
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];
const missingEnv = requiredEnvVars.filter((k) => !process.env[k]);

let app: ReturnType<typeof initializeApp> | undefined;
let db: ReturnType<typeof getFirestore> | undefined;
let auth: ReturnType<typeof getAuth> | undefined;

if (missingEnv.length) {
  const msg = `Missing Firebase env vars: ${missingEnv.join(', ')}`;
  if (process.env.NODE_ENV === 'production') {
    // In production, don't initialize Firebase (avoid runtime errors during build/prerender)
    // Warn so site can still boot and handle gracefully (some environments may not require all features)
    console.warn(msg);
  } else {
    // Fail fast in development so developers notice configuration errors early
    throw new Error(msg);
  }
} else {
  // All required env vars are present — initialize Firebase services
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

let analytics: ReturnType<typeof getAnalytics> | undefined;
// Only initialize analytics on the client when a measurement ID is present and app is initialized
if (typeof window !== 'undefined' && firebaseConfig.measurementId && app) {
  try {
    analytics = getAnalytics(app);
  } catch {
    // Analytics may fail in some environments; ignore silently
  }
}

export { app, db, auth, analytics };
