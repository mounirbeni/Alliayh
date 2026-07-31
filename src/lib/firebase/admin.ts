import 'server-only';
import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin bootstrap.
 *
 * Credentials are resolved in the order that matches how this app is deployed:
 *
 *  1. `FIREBASE_SERVICE_ACCOUNT_KEY` — a JSON service account, for local
 *     development and for hosts without workload identity.
 *  2. Application Default Credentials — what Firebase App Hosting and Cloud Run
 *     provide automatically, with no secret to manage.
 *
 * When neither is present the app keeps running against the in-memory adapters
 * instead of crashing at boot, so a contributor without credentials can still
 * work on the storefront.
 */

const APP_NAME = 'lueur-admin';

let cachedApp: App | null = null;

/** Whether a real Firebase backend is reachable. */
export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIREBASE_PROJECT_ID ||
      process.env.GOOGLE_CLOUD_PROJECT,
  );
}

function initAdminApp(): App {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return existing;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountJson) {
    let parsed: { project_id?: string; client_email?: string; private_key?: string };
    try {
      parsed = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the whole service account file as a single-line value.',
      );
    }

    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing project_id, client_email or private_key.');
    }

    return initializeApp(
      {
        credential: cert({
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          // Env vars flatten newlines; the PEM will not parse without them back.
          privateKey: parsed.private_key.replace(/\\n/g, '\n'),
        }),
        projectId: parsed.project_id,
      },
      APP_NAME,
    );
  }

  // Application Default Credentials.
  return initializeApp(
    {
      projectId:
        process.env.FIREBASE_PROJECT_ID ?? process.env.GOOGLE_CLOUD_PROJECT ?? undefined,
    },
    APP_NAME,
  );
}

export function getAdminApp(): App {
  if (!cachedApp) {
    cachedApp = getApps().some((app) => app.name === APP_NAME) ? getApp(APP_NAME) : initAdminApp();
  }
  return cachedApp;
}

let cachedDb: Firestore | null = null;

export function getAdminFirestore(): Firestore {
  if (!cachedDb) {
    cachedDb = getFirestore(getAdminApp());
    // Keeps `undefined` fields from throwing on write; our Order type has
    // several genuinely optional address fields.
    cachedDb.settings({ ignoreUndefinedProperties: true });
  }
  return cachedDb;
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
