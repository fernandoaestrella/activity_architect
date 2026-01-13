/**
 * Seed script for Activity Architect
 * Run with: node scripts/seedData.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore/lite';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBbyEBvRUfEYTbko-tg0-s1zXOkEeLgeB8",
  authDomain: "activity-architect-1.firebaseapp.com",
  projectId: "activity-architect-1",
  storageBucket: "activity-architect-1.firebasestorage.app",
  messagingSenderId: "397358438348",
  appId: "1:397358438348:web:c324ebc6cc1dd3fe016f69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===================== DIMENSIONS DATA =====================
const DIMENSIONS = [
  // Chakra System
  { key: 'root_chakra', label: 'Root Chakra', description: 'Stability, security, and basic needs', category: 'chakra' },
  { key: 'sacral_chakra', label: 'Sacral Chakra', description: 'Creativity, sexuality, and emotions', category: 'chakra' },
  { key: 'solar_plexus_chakra', label: 'Solar Plexus Chakra', description: 'Self-worth, confidence, and power', category: 'chakra' },
  { key: 'heart_chakra', label: 'Heart Chakra', description: 'Love, compassion, and connection', category: 'chakra' },
  { key: 'throat_chakra', label: 'Throat Chakra', description: 'Communication, self-expression, and truth', category: 'chakra' },
  { key: 'third_eye_chakra', label: 'Third Eye Chakra', description: 'Intuition, imagination, and wisdom', category: 'chakra' },
  { key: 'crown_chakra', label: 'Crown Chakra', description: 'Spirituality, enlightenment, and transcendence', category: 'chakra' },

  // Activity Mechanics
  { key: 'objective', label: 'Objective Clarity', description: 'How well defined the goals are', category: 'mechanics' },
  { key: 'interactivity', label: 'Interactivity', description: 'How immediately your actions affect the next moment-to-moment state; the tightness of the input-feedback loop', category: 'mechanics' },
  { key: 'speed', label: 'Time Quantum (Speed)', description: 'Length of steps relative to time', category: 'mechanics' },
  { key: 'spatial', label: 'Spatial Needs', description: 'Requirement of physical/simulated space', category: 'mechanics' },
  { key: 'discovery', label: 'Discovery Amount', description: 'Potential to find new aspects', category: 'mechanics' },
  { key: 'response', label: 'Response Intensity', description: 'Force of the activity\'s feedback', category: 'mechanics' },
  { key: 'challenge', label: 'Challenge Alignment', description: 'Abilities vs requirements match', category: 'mechanics' },
  { key: 'personalization', label: 'Personalization Depth', description: 'Ability to express your core self', category: 'mechanics' },
  { key: 'avatar', label: 'Avatar Agency', description: 'Control over self-representation', category: 'mechanics' },
  { key: 'curve', label: 'Learning Curve', description: 'Steepness of skill progression', category: 'mechanics' },
  { key: 'random', label: 'Randomicity', description: 'Prevalence of unpredictable elements', category: 'mechanics' },

  // Temporal & Commitment
  { key: 'duration', label: 'Session Duration', description: 'Typical length of a single engagement session', category: 'temporal' },
  { key: 'frequency', label: 'Engagement Frequency', description: 'How often the activity invites return participation', category: 'temporal' },
  { key: 'commitment', label: 'Commitment Level', description: 'Long-term investment required to see meaningful progress', category: 'temporal' },

  // Cognitive & Mental State
  { key: 'cognitive_load', label: 'Cognitive Load', description: 'Mental effort and concentration required', category: 'cognitive' },
  { key: 'mindfulness', label: 'Mindfulness Potential', description: 'Capacity to bring present-moment awareness', category: 'cognitive' },
  { key: 'flow', label: 'Flow Accessibility', description: 'Ease of entering an absorbed, timeless state', category: 'cognitive' },

  // Social & Relational
  { key: 'collaboration', label: 'Collaboration Depth', description: 'Degree of meaningful teamwork with others', category: 'social' },
  { key: 'competition', label: 'Competitive Intensity', description: 'Level of rivalry or ranking against others', category: 'social' },
  { key: 'mentorship', label: 'Teaching/Learning Ratio', description: 'Opportunities to guide others or be guided', category: 'social' },
  { key: 'audience', label: 'Audience Presence', description: 'Visibility or performance aspect to observers', category: 'social' },

  // Physicality & Sensory
  { key: 'physical_exertion', label: 'Physical Exertion', description: 'Bodily effort and energy expenditure', category: 'physical' },
  { key: 'sensory_richness', label: 'Sensory Richness', description: 'Variety and depth of sensory stimulation', category: 'physical' },
  { key: 'tactile', label: 'Tactile Engagement', description: 'Hands-on, physical manipulation involved', category: 'physical' },

  // Autonomy & Agency
  { key: 'autonomy', label: 'Autonomy Level', description: 'Freedom to make independent choices', category: 'autonomy' },
  { key: 'consequence', label: 'Consequence Weight', description: 'How permanently decisions persist and affect long-term outcomes; the lasting stakes of your choices', category: 'autonomy' },
  { key: 'mastery', label: 'Mastery Ceiling', description: 'Ultimate depth of expertise attainable', category: 'autonomy' },

  // Outcome & Purpose
  { key: 'tangibility', label: 'Output Tangibility', description: 'Whether the activity produces concrete artifacts', category: 'outcome' },
  { key: 'utility', label: 'Real-World Utility', description: 'Practical applicability outside the activity', category: 'outcome' },
  { key: 'legacy', label: 'Legacy Potential', description: 'Ability to leave lasting contributions', category: 'outcome' },

  // Emotional & Affective
  { key: 'novelty', label: 'Novelty Seeking', description: 'Freshness and new experiences provided', category: 'emotional' },
  { key: 'nostalgia', label: 'Nostalgia Factor', description: 'Connection to familiar, comforting elements', category: 'emotional' },
  { key: 'risk', label: 'Risk/Thrill Level', description: 'Excitement from uncertainty or danger', category: 'emotional' },
  { key: 'catharsis', label: 'Cathartic Release', description: 'Emotional processing and relief potential', category: 'emotional' },

  // Accessibility
  { key: 'cost', label: 'Financial Investment', description: 'Money required to participate', category: 'accessibility' },
  { key: 'barrier', label: 'Entry Barrier', description: 'Difficulty of starting as a complete beginner', category: 'accessibility' },
  { key: 'accessibility', label: 'Physical Accessibility', description: 'Accommodation for different physical abilities', category: 'accessibility' },

  // Maslow's Hierarchy
  { key: 'physiological', label: 'Physiological Need', description: 'Supply of bodily/physical needs', category: 'maslow' },
  { key: 'safety', label: 'Safety & Security', description: 'Stability, protection, and freedom from fear', category: 'maslow' },
  { key: 'social', label: 'Social Belonging', description: 'Connection, intimacy, and sense of community', category: 'maslow' },
  { key: 'esteem', label: 'Esteem & Status', description: 'Respect, recognition, and self-worth', category: 'maslow' },
  { key: 'actualization', label: 'Self-Actualization', description: 'Growth, meaning, and transcendence', category: 'maslow' }
];

// ===================== ACTIVITIES DATA =====================
// Import from separate file to keep this manageable
import { ACTIVITIES } from './activitiesData.js';

// ===================== SEED FUNCTIONS =====================

async function seedDimensions() {
  console.log('Seeding dimensions...');
  const batch = writeBatch(db);
  
  DIMENSIONS.forEach((dimension, index) => {
    const docRef = doc(collection(db, 'dimensions'));
    batch.set(docRef, { ...dimension, order: index });
  });
  
  await batch.commit();
  console.log(`✓ Seeded ${DIMENSIONS.length} dimensions`);
}

async function seedActivities() {
  console.log('Seeding activities...');
  const BATCH_SIZE = 450;
  const chunks = [];
  
  for (let i = 0; i < ACTIVITIES.length; i += BATCH_SIZE) {
    chunks.push(ACTIVITIES.slice(i, i + BATCH_SIZE));
  }
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const batch = writeBatch(db);
    
    chunk.forEach((activity) => {
      const docRef = doc(collection(db, 'activities'));
      batch.set(docRef, {
        ...activity,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    console.log(`  Batch ${i + 1}/${chunks.length}: ${chunk.length} activities`);
  }
  
  console.log(`✓ Seeded ${ACTIVITIES.length} activities total`);
}

async function main() {
  console.log('🌱 Starting database seed...\n');
  
  try {
    await seedDimensions();
    await seedActivities();
    console.log('\n✅ Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

main();
