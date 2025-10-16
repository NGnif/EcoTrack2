# EcoTrack

EcoTrack is a Next.js application that helps users track their carbon footprint by logging daily activities related to transport, energy, and diet. It calculates CO₂e emissions and provides personalized tips for reduction.

This project is built with:

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Backend**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit) for personalized tips

## Features

-   **Firebase Authentication**: Secure user sign-up and login with email and password.
-   **Activity Logging**: Log daily activities across transport, energy, and diet.
-   **CO₂e Calculation**: Automatic carbon emission calculation based on logged activities.
-   **Dashboard**: Visualize your weekly carbon footprint with charts and key stats.
-   **Activity History**: Review and manage your past activity logs.
-   **Personalized Tips**: Get AI-powered suggestions to reduce your carbon footprint.
-   **Settings**: Manage your user profile.

## Firebase Setup

Before you begin, you'll need to create a Firebase project.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the on-screen instructions.
3.  Once your project is created, go to **Project settings** (the gear icon).
4.  In the **General** tab, under "Your apps", click the web icon (`</>`) to add a new web app.
5.  Register your app. You don't need to add the SDKs via script tags.
6.  After registration, you'll see your Firebase configuration object. You'll need these keys for your environment variables.
7.  In the Firebase console, go to the **Authentication** section.
8.  Click **"Get started"**.
9.  Under the **Sign-in method** tab, enable the **Email/Password** provider.
10. Go to the **Firestore Database** section.
11. Click **"Create database"**.
12. Start in **production mode**. This is important for security rules to apply correctly.
13. Choose a Firestore location.
14. The provided `firestore.rules` will be applied automatically on deployment if using Firebase Hosting. For local development, you can use the Firebase Emulator Suite or ensure your test data follows the rules.

## Getting Started Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd ecotrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

Now, open `.env.local` and fill in your Firebase project's configuration keys.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Testing

This project uses Jest for unit tests. To run the tests:

```bash
npm test
```

## Deployment

This app is configured for easy deployment with [Firebase Hosting](https://firebase.google.com/docs/hosting).

1.  Install the Firebase CLI:

    ```bash
    npm install -g firebase-tools
    ```

2.  Login to Firebase:

    ```bash
    firebase login
    ```

3.  Initialize Firebase in your project (if you haven't already):

    ```bash
    firebase init hosting
    ```
    - Select "Use an existing project" and choose your Firebase project.
    - Set your public directory to `out`.
    - Configure as a single-page app (rewrite all urls to /index.html): **No**.

4.  Build the application:

    ```bash
    npm run build
    ```

5.  Deploy to Firebase Hosting:

    ```bash
    firebase deploy --only hosting
    ```
