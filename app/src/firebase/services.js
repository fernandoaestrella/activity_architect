import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const COLLECTIONS = {
  ACTIVITIES: 'activities',
  DIMENSIONS: 'dimensions'
};

// ==================== DIMENSIONS ====================

/**
 * Get all dimensions
 */
export async function getAllDimensions() {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.DIMENSIONS));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Get a single dimension by key
 */
export async function getDimensionByKey(key) {
  const q = query(collection(db, COLLECTIONS.DIMENSIONS), where('key', '==', key));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

// ==================== ACTIVITIES ====================

/**
 * Get all activities
 */
export async function getAllActivities() {
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.ACTIVITIES));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Get a single activity by ID
 */
export async function getActivityById(activityId) {
  const docRef = doc(db, COLLECTIONS.ACTIVITIES, activityId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

/**
 * Add a new activity
 */
export async function addActivity(activityData) {
  const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), {
    ...activityData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
}

/**
 * Update an existing activity
 */
export async function updateActivity(activityId, updates) {
  const docRef = doc(db, COLLECTIONS.ACTIVITIES, activityId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date()
  });
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId) {
  const docRef = doc(db, COLLECTIONS.ACTIVITIES, activityId);
  await deleteDoc(docRef);
}

/**
 * Query activities by dimension range
 * @param {string} dimensionKey - The dimension to filter by
 * @param {number} minValue - Minimum value (inclusive)
 * @param {number} maxValue - Maximum value (inclusive)
 */
export async function queryActivitiesByDimension(dimensionKey, minValue, maxValue) {
  const q = query(
    collection(db, COLLECTIONS.ACTIVITIES),
    where(dimensionKey, '>=', minValue),
    where(dimensionKey, '<=', maxValue)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ==================== BATCH OPERATIONS ====================

/**
 * Seed dimensions to Firestore (batch write)
 * @param {Array} dimensions - Array of dimension objects
 */
export async function seedDimensions(dimensions) {
  const batch = writeBatch(db);
  
  dimensions.forEach((dimension) => {
    const docRef = doc(collection(db, COLLECTIONS.DIMENSIONS));
    batch.set(docRef, dimension);
  });
  
  await batch.commit();
  console.log(`Seeded ${dimensions.length} dimensions`);
}

/**
 * Seed activities to Firestore (batch write)
 * Firestore has a limit of 500 writes per batch, so we chunk if needed
 * @param {Array} activities - Array of activity objects
 */
export async function seedActivities(activities) {
  const BATCH_SIZE = 450; // Leave some room under the 500 limit
  const chunks = [];
  
  for (let i = 0; i < activities.length; i += BATCH_SIZE) {
    chunks.push(activities.slice(i, i + BATCH_SIZE));
  }
  
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    
    chunk.forEach((activity) => {
      const docRef = doc(collection(db, COLLECTIONS.ACTIVITIES));
      batch.set(docRef, {
        ...activity,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    console.log(`Seeded batch of ${chunk.length} activities`);
  }
  
  console.log(`Total seeded: ${activities.length} activities`);
}

/**
 * Clear all documents from a collection
 * @param {string} collectionName - Name of collection to clear
 */
export async function clearCollection(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);
  
  querySnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`Cleared ${querySnapshot.size} documents from ${collectionName}`);
}
