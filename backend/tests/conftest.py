import os

os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
os.environ.setdefault("FIREBASE_PROJECT_ID", "test-project")
os.environ.setdefault("FIREBASE_CLIENT_EMAIL", "firebase-adminsdk@test-project.iam.gserviceaccount.com")
os.environ.setdefault(
    "FIREBASE_PRIVATE_KEY",
    "-----BEGIN PRIVATE KEY-----\\ntest\\n-----END PRIVATE KEY-----\\n",
)
os.environ.setdefault("CORTEX_URL", "https://cortex.example.test")
os.environ.setdefault("CORTEX_API_KEY", "test-key")
