# MoodLab – Visual Moodboard Creator (Next.js + Firebase + Fabric.js)

MoodLab is a modern visual moodboard app that allows users to create, customise, and export moodboards with sticky notes, images, text, and drawings. It supports both guest mode (localStorage + IndexedDB) and authenticated users (Firebase Auth & Firestore).

---

## Features

- Guest & Authenticated modes
- Drag-and-drop canvas with:
  - Images (uploaded or stored locally)
  - Sticky notes
  - Text
  - Shapes
- Color picker & styling
- Auto-save (Firestore or IndexedDB)
- Firebase integration:
  - Auth
  - Firestore moodboard storage
  - Firebase Storage for image uploads
- Export or delete moodboards
- Mobile responsive

---

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Fabric.js (Canvas-based UI)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/ljames97/mood-lab.git
cd moodlab
2. Install dependencies
bash
Copy
Edit
npm install
3. Configure Firebase
Create a .env.local file in the root and add your Firebase keys:

ini
Copy
Edit
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
You can get these from your Firebase project settings.

4. Run dev server
bash
Copy
Edit
npm run dev

Build & Deploy
To build for production:

bash
Copy
Edit
npm run build
npm start
This app is designed for deployment on Vercel, but you can deploy it anywhere Next.js is supported.

---

TODO:
 - Undo/redo functionality
 - Testing
 - Real-time collaboration
 - Add more object tools (arrows, custom shapes)
 - Better mobile UX
 - Export to PDF