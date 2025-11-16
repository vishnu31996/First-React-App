import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc,getDoc, setDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";


// Update player score
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Optional analytics (only in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

// --- Firestore instance ---
const db = getFirestore(app);

// Only update once when the game ends
export async function updatePlayerScore(name, finalScore) {
  const docRef = doc(db, "highscores", name);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const updatedScore = finalScore > data.score ? finalScore : data.score;
    const updatedPlays = (data.plays || 0) + 1;

    await setDoc(docRef, {
      name,
      score: updatedScore,
      plays: updatedPlays
    });
  } else {
    // First game
    await setDoc(docRef, { name, score: finalScore, plays: 1 });
  }
}

// --- Subscribe to real-time leaderboard ---
export function subscribeLeaderboard(callback) {
  const q = query(collection(db, "highscores"), orderBy("score", "desc"));
  return onSnapshot(q, (snapshot) => {
    const top = snapshot.docs.map(doc => doc.data());
    callback(top);
  });
}

// Check if player name exists
export async function checkPlayerNameExists(name) {
  const docRef = doc(db, "highscores", name);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function getPlayerData(name) {
  const docRef = doc(db, "highscores", name);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : { score: 0, plays: 0 };
}