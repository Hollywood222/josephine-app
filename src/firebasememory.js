
import { getFirestore, collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

// Save memory
export async function saveMessageToMemory(message) {
  try {
    const docRef = await addDoc(collection(db, 'josephine-memory'), {
      text: message,
      timestamp: new Date()
    });
    console.log('🧠 Memory saved with ID:', docRef.id);
  } catch (e) {
    console.error('Error saving memory:', e);
  }
}

// Read last few memories
export async function recallLastMemories(limitCount = 3) {
  try {
    const memoryQuery = query(
      collection(db, 'josephine-memory'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(memoryQuery);
    const memories = snapshot.docs.map(doc => doc.data().text);
    console.log('🧠 Recalled memories:', memories);
    return memories;
  } catch (e) {
    console.error('Error recalling memories:', e);
    return [];
  }
}