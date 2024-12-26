import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, addDoc, doc, getDoc, getDocs, where } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch requests
export function fetchData(userId, callback) {
    const exercisesRef = collection(db, 'Exercises');
    const q = query(
        exercisesRef, 
        where('userId', '==', userId),
    );

    // Listen to changes in the 'exercises' collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(data); // Passing updated data to the callback function
    });

    // Return the unsubscribe function so you can detach the listener later
    return unsubscribe;
};

// Log an exercise in the database 
export async function logExercise(userId, exercise) {
    try {
        const docRef = await addDoc(collection(db, "Exercises"), {...exercise, userId});
        return docRef.id;
    } catch (error) {
        throw new Error("Error logging exercise: " + error.message);
    }
};

// Check if a user id exists
export async function checkUserExists(id) {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists()
    return exists;
}

// Check if a exercise exists
export async function checkExerciseExists(userId, exerciseName) {
    const exercisesRef = collection(db, 'Exercises');
    const q = query(
        exercisesRef, 
        where('userId', '==', userId),
        where('name', '==', exerciseName)
    );

    const querySnapshot = await getDocs(q);
    const exists = !querySnapshot.empty;
    return exists;
}

