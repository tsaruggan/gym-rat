import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, onSnapshot, addDoc, doc, getDoc, setDoc, where, updateDoc, deleteDoc } from "firebase/firestore";
import { customAlphabet } from 'nanoid';

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

// Fetch all data for a given user
export function fetchAllData(userId, callback) {
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

// Fetch specific exercise data for a given user 
export function fetchExerciseData(userId, exerciseName, callback) {
    const exercisesRef = collection(db, 'Exercises');
    const q = query(
        exercisesRef,
        where('userId', '==', userId),
        where('name', '==', exerciseName)
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
        const docRef = await addDoc(collection(db, "Exercises"), { ...exercise, userId });
    } catch (error) {
        throw new Error("Error:" + error.message);
    }
};

// Edit an existing exercise in the database
export async function editExercise(exerciseId, updatedExercise) {
    try {
        const docRef = doc(db, "Exercises", exerciseId);
        await updateDoc(docRef, updatedExercise);
    } catch (error) {
        throw new Error("Error:" + error.message);
    }
};

// Delete an exercise from the database
export async function deleteExercise(exerciseId) {
    try {
        const docRef = doc(db, "Exercises", exerciseId);
        await deleteDoc(docRef);
    } catch (error) {
        throw new Error("Error:" + error.message);
    }
};

// Get user by id
export async function fetchUser(userId) {
    try {
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Error:" + error.message);
    }
}

// Update user preferences (darkMode and units)
export async function updateUserPreferences(userId, preferences) {
    try {
        const userRef = doc(db, "Users", userId);
        await updateDoc(userRef, {
            preferences: preferences
        });
    } catch (error) {
        throw new Error("Error:" + error.message);
    }
}

// Check if a user id exists
export async function checkUserExists(userId) {
    const docRef = doc(db, "Users", userId);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists()
    return exists;
}

// Generate a new user id
export async function createUser() {
    try {
        const nanoidBase32 = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

        // Ensure the generated user ID doesn't already exist
        let exists = true;
        let id;
        while (exists) {
            id = nanoidBase32(); // 8-character Base32 ID
            exists = await checkUserExists(id);
        }

        const user = { "id": id, "preferences": { "darkMode": false, "units": "lb" } };
        const docRef = doc(collection(db, 'Users'), id);
        await setDoc(docRef, user);
        return id;
    } catch (error) {
        console.error('Error adding document: ', error);
    }
}