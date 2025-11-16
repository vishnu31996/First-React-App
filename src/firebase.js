// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3gjobHSra-3bHMH6325nMM0rHFfwLyjs",
  authDomain: "first-react-app-f08c5.firebaseapp.com",
  databaseURL: "https://first-react-app-f08c5-default-rtdb.firebaseio.com",
  projectId: "first-react-app-f08c5",
  storageBucket: "first-react-app-f08c5.firebasestorage.app",
  messagingSenderId: "93087979838",
  appId: "1:93087979838:web:309e97b6d7d5e10d7cb46f",
  measurementId: "G-17C6P6SWZ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (typeof window !== "undefined") { // Only in browser
  analytics = getAnalytics(app);
}

export { analytics };

// Initialize Firestore

const db = getFirestore(app); // ✅ declare db here

// Single global highscore doc
export async function getGlobalHighScore() {
  const docRef = doc(db, "highscores", "constructionGame");
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data().highScore : 0;
}
export async function updateGlobalHighScoreIfHigher(score) {
  const docRef = doc(db, "highscores", "constructionGame");
  const snap = await getDoc(docRef);
  if (!snap.exists() || score > snap.data().highScore) {
    await setDoc(docRef, { highScore: score });
  }
}

// Leaderboard (scalable) helpers
export async function submitScore(name, score) {
  return await addDoc(collection(db, "constructionGameLeaderboard"), {
    name,
    score,
    created: new Date(),
  });
}

export async function getLeaderboardTop10() {
  const q = query(
    collection(db, "constructionGameLeaderboard"),
    orderBy("score", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  const list = [];
  snap.forEach((d) => list.push({ ...d.data() }));
  return list;
}