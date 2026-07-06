export const config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "missing-firebase-api-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "missing-firebase-auth-domain",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "missing-firebase-project-id",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "missing-firebase-app-id"
  }
};
