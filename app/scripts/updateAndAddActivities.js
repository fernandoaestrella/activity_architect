/**
 * Update existing activities with new dimensions AND add new movies/series/games
 * Run with: node scripts/updateAndAddActivities.js
 */

import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore/lite';
import { readFileSync } from 'fs';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Import new activities data
import { NEW_MOVIES_SERIES } from '../src/data/newMoviesSeries.js';
import { NEW_GAMES_ALLTIME } from '../src/data/newGamesAllTime.js';
import { NEW_GAMES_MODERN } from '../src/data/newGamesModern.js';

// Parse CSV manually (avoid dependency)
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const record = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx]?.trim() || '';
    });
    records.push(record);
  }
  return records;
}

async function updateAndAddActivities() {
  console.log('🔄 Starting activity update and addition...\n');

  // STEP 1: Update existing activities with 8 new dimension values
  console.log('📊 STEP 1: Updating existing activities with new dimensions...');
  
  const csvContent = readFileSync('./src/data/existing_activities_new_dims.csv', 'utf-8');
  const records = parseCSV(csvContent);

  // Get all existing activities
  const activitiesSnapshot = await getDocs(collection(db, 'activities'));
  const activitiesMap = new Map();
  activitiesSnapshot.docs.forEach(docSnap => {
    activitiesMap.set(docSnap.data().name, docSnap.id);
  });

  console.log(`  Found ${activitiesMap.size} existing activities in database`);

  let updatedCount = 0;
  for (const record of records) {
    const activityId = activitiesMap.get(record.name);
    if (activityId) {
      const activityRef = doc(db, 'activities', activityId);
      await updateDoc(activityRef, {
        discovery_ease: parseInt(record.discovery_ease),
        feedback_clarity: parseInt(record.feedback_clarity),
        repeatability: parseInt(record.repeatability),
        perspective: parseInt(record.perspective),
        intuitiveness: parseInt(record.intuitiveness),
        planning: parseInt(record.planning),
        parallelism: parseInt(record.parallelism),
        skill_transfer: parseInt(record.skill_transfer)
      });
      updatedCount++;
      if (updatedCount % 20 === 0) {
        console.log(`  ✓ Updated ${updatedCount} activities...`);
      }
    } else {
      console.log(`  ⚠ Activity not found in DB: "${record.name}"`);
    }
  }
  console.log(`  ✅ Updated ${updatedCount} existing activities with new dimensions\n`);

  // STEP 2: Add new movies/series/games
  console.log('🎬 STEP 2: Adding new movies, series, and games...');
  
  const allNewActivities = [
    ...NEW_MOVIES_SERIES,
    ...NEW_GAMES_ALLTIME,
    ...NEW_GAMES_MODERN
  ];

  // Filter out any that already exist
  const newToAdd = allNewActivities.filter(activity => !activitiesMap.has(activity.name));
  
  console.log(`  📝 ${allNewActivities.length} total new activities`);
  console.log(`  📝 ${newToAdd.length} after filtering duplicates`);

  // Add in batches of 20
  const batchSize = 20;
  let addedCount = 0;
  
  for (let i = 0; i < newToAdd.length; i += batchSize) {
    const batch = writeBatch(db);
    const currentBatch = newToAdd.slice(i, i + batchSize);
    
    for (const activity of currentBatch) {
      const docRef = doc(collection(db, 'activities'));
      batch.set(docRef, activity);
    }
    
    await batch.commit();
    addedCount += currentBatch.length;
    console.log(`  ✓ Added ${addedCount} of ${newToAdd.length} new activities...`);
  }

  console.log(`\n✅ Complete!`);
  console.log(`   - Updated: ${updatedCount} existing activities`);
  console.log(`   - Added: ${addedCount} new activities`);
  console.log(`   - Total activities now: ${activitiesMap.size + addedCount}`);
  console.log('\n   Refresh your browser (Ctrl+Shift+R) to see the changes.');
  
  process.exit(0);
}

updateAndAddActivities().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
