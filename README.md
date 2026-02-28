# BloomFocus (Gamified Study App)

BloomFocus is a full-stack React + Firebase productivity app for students.
Users can:

- Sign up/login with email + password
- Study with a timer
- Earn 1 point for every 1 minute studied
- Manage an editable to-do list
- Spend points to buy flowers
- Grow a persistent virtual garden

## Tech Stack

- React + Vite
- TailwindCSS
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting (deploy-ready)

## Firestore Data Model

```text
users (collection)
  userId (document)
    email: string
    totalPoints: number
    totalStudyTime: number

    tasks (subcollection)
      taskId
        title: string
        completed: boolean
        createdAt: timestamp

    garden (subcollection)
      itemId
        flowerId: string
        purchasedAt: timestamp
```

## Firebase Setup

1. Create a Firebase project.
2. Enable **Authentication > Email/Password**.
3. Enable **Firestore Database**.
4. Copy `.env.example` to `.env` and fill in your Firebase web config values:

```bash
cp .env.example .env
```

5. Install and run:

```bash
npm install
npm run dev
```

## Build / Deploy

Build production files:

```bash
npm run build
```

Deploy with Firebase Hosting (if Firebase CLI is configured):

```bash
firebase deploy
```

## App Structure

```text
src/
  components/
    AuthForm.jsx
    GardenView.jsx
    PointsSummary.jsx
    StorePanel.jsx
    StudyTimer.jsx
    TaskSidebar.jsx
  data/
    flowers.js
  firebase/
    auth.js
    config.js
    firestore.js
  hooks/
    useStudyTimer.js
  utils/
    time.js
  App.jsx
  index.css
  main.jsx
```
