/**
 * Reseed ONLY dimensions (not activities)
 * Run with: node scripts/reseedDimensions.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, getDocs, deleteDoc } from 'firebase/firestore/lite';

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
  // ═══════════════════════════════════════════════════════════════════════════
  // ENGAGEMENT & FUN FACTORS (What makes activities enjoyable)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'flow', label: 'Flow Accessibility', description: 'Ease of entering an absorbed, timeless state', category: 'engagement' },
  { key: 'challenge', label: 'Challenge Alignment', description: 'Abilities vs requirements match', category: 'engagement' },
  { key: 'discovery', label: 'Discovery Amount', description: 'Potential to find new aspects', category: 'engagement' },
  { key: 'discovery_ease', label: 'Ease of Discovery', description: 'How easily can aspects of the activity be discovered?', category: 'engagement' },
  { key: 'novelty', label: 'Novelty Seeking', description: 'Freshness and new experiences provided', category: 'engagement' },
  { key: 'risk', label: 'Risk/Thrill Level', description: 'Excitement from uncertainty or danger', category: 'engagement' },
  { key: 'interactivity', label: 'Interactivity', description: 'How immediately your actions affect the next moment-to-moment state; the tightness of the input-feedback loop', category: 'engagement' },
  { key: 'response', label: 'Response Intensity', description: 'Force of the activity\'s feedback', category: 'engagement' },
  { key: 'feedback_clarity', label: 'Feedback Clarity', description: 'How effectively the activity communicates consequences of your actions', category: 'engagement' },
  { key: 'sensory_richness', label: 'Sensory Richness', description: 'Variety and depth of sensory stimulation', category: 'engagement' },
  { key: 'random', label: 'Randomicity', description: 'Prevalence of unpredictable elements', category: 'engagement' },
  { key: 'repeatability', label: 'Repeatability', description: 'How repetitive is the core loop? How much are steps repeated?', category: 'engagement' },
  { key: 'perspective', label: 'Perspective Mode', description: 'The viewpoint from which you experience the activity (first-person, third-person, observer, god-view)', category: 'engagement' },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME & COMMITMENT (Practical scheduling concerns)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'duration', label: 'Session Duration', description: 'Typical length of a single engagement session', category: 'temporal' },
  { key: 'frequency', label: 'Engagement Frequency', description: 'How often the activity invites return participation', category: 'temporal' },
  { key: 'commitment', label: 'Commitment Level', description: 'Long-term investment required to see meaningful progress', category: 'temporal' },
  { key: 'barrier', label: 'Entry Barrier', description: 'Difficulty of starting as a complete beginner', category: 'accessibility' },
  { key: 'cost', label: 'Financial Investment', description: 'Money required to participate', category: 'accessibility' },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL ASPECTS (Connection with others)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'collaboration', label: 'Collaboration Depth', description: 'Degree of meaningful teamwork with others', category: 'social' },
  { key: 'competition', label: 'Competitive Intensity', description: 'Level of rivalry or ranking against others', category: 'social' },
  { key: 'mentorship', label: 'Teaching/Learning Ratio', description: 'Opportunities to guide others or be guided', category: 'social' },
  { key: 'audience', label: 'Audience Presence', description: 'Visibility or performance aspect to observers', category: 'social' },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL & SENSORY (Body involvement)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'physical_exertion', label: 'Physical Exertion', description: 'Bodily effort and energy expenditure', category: 'physical' },
  { key: 'tactile', label: 'Tactile Engagement', description: 'Hands-on, physical manipulation involved', category: 'physical' },
  { key: 'spatial', label: 'Spatial Needs', description: 'Requirement of physical/simulated space', category: 'physical' },
  { key: 'accessibility', label: 'Physical Accessibility', description: 'Accommodation for different physical abilities', category: 'accessibility' },

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE & MENTAL (Mind involvement)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'cognitive_load', label: 'Cognitive Load', description: 'Mental effort and concentration required', category: 'cognitive' },
  { key: 'mindfulness', label: 'Mindfulness Potential', description: 'Capacity to bring present-moment awareness', category: 'cognitive' },
  { key: 'intuitiveness', label: 'Intuitiveness', description: 'How obvious is it what you should do? How easily can actions and their effects be understood?', category: 'cognitive' },
  { key: 'objective', label: 'Objective Clarity', description: 'How well defined the goals are', category: 'mechanics' },
  { key: 'curve', label: 'Learning Curve', description: 'Steepness of skill progression', category: 'mechanics' },
  { key: 'speed', label: 'Reaction Speed', description: 'How quickly must you act? The time pressure on your decisions and actions', category: 'mechanics' },
  { key: 'planning', label: 'Planning Required', description: 'How much forethought and strategic thinking each step requires', category: 'cognitive' },
  { key: 'parallelism', label: 'Parallelism', description: 'Can you do multiple things at once? How much can steps be performed simultaneously?', category: 'mechanics' },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTONOMY & AGENCY (Freedom and control)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'autonomy', label: 'Autonomy Level', description: 'Freedom to make independent choices', category: 'autonomy' },
  { key: 'personalization', label: 'Personalization Depth', description: 'Ability to express your core self', category: 'autonomy' },
  { key: 'avatar', label: 'Avatar Agency', description: 'Control over self-representation', category: 'autonomy' },
  { key: 'consequence', label: 'Consequence Weight', description: 'How permanently decisions persist and affect long-term outcomes; the lasting stakes of your choices', category: 'autonomy' },

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTCOMES & LONG-TERM VALUE (What you get from it)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'mastery', label: 'Mastery Ceiling', description: 'Ultimate depth of expertise attainable', category: 'outcome' },
  { key: 'utility', label: 'Real-World Utility', description: 'Practical applicability outside the activity', category: 'outcome' },
  { key: 'skill_transfer', label: 'Skill Transferability', description: 'How well do skills learned transfer to real life or other activities?', category: 'outcome' },
  { key: 'tangibility', label: 'Output Tangibility', description: 'Whether the activity produces concrete artifacts', category: 'outcome' },
  { key: 'legacy', label: 'Legacy Potential', description: 'Ability to leave lasting contributions', category: 'outcome' },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL & AFFECTIVE (Feelings and nostalgia)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'catharsis', label: 'Cathartic Release', description: 'Emotional processing and relief potential', category: 'emotional' },
  { key: 'nostalgia', label: 'Nostalgia Factor', description: 'Connection to familiar, comforting elements', category: 'emotional' },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAKRA SYSTEM (Grouped - Spiritual/energetic dimensions)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'root_chakra', label: 'Root Chakra', description: 'Stability, security, and basic needs', category: 'chakra' },
  { key: 'sacral_chakra', label: 'Sacral Chakra', description: 'Creativity, sexuality, and emotions', category: 'chakra' },
  { key: 'solar_plexus_chakra', label: 'Solar Plexus Chakra', description: 'Self-worth, confidence, and power', category: 'chakra' },
  { key: 'heart_chakra', label: 'Heart Chakra', description: 'Love, compassion, and connection', category: 'chakra' },
  { key: 'throat_chakra', label: 'Throat Chakra', description: 'Communication, self-expression, and truth', category: 'chakra' },
  { key: 'third_eye_chakra', label: 'Third Eye Chakra', description: 'Intuition, imagination, and wisdom', category: 'chakra' },
  { key: 'crown_chakra', label: 'Crown Chakra', description: 'Spirituality, enlightenment, and transcendence', category: 'chakra' },

  // ═══════════════════════════════════════════════════════════════════════════
  // MASLOW'S HIERARCHY (Grouped at very bottom - Foundational needs)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'physiological', label: 'Physiological Need', description: 'Supply of bodily/physical needs', category: 'maslow' },
  { key: 'safety', label: 'Safety & Security', description: 'Stability, protection, and freedom from fear', category: 'maslow' },
  { key: 'social', label: 'Social Belonging', description: 'Connection, intimacy, and sense of community', category: 'maslow' },
  { key: 'esteem', label: 'Esteem & Status', description: 'Respect, recognition, and self-worth', category: 'maslow' },
  { key: 'actualization', label: 'Self-Actualization', description: 'Growth, meaning, and transcendence', category: 'maslow' }
];

async function reseedDimensions() {
  console.log('🔄 Reseeding dimensions only...\n');
  
  try {
    // Step 1: Delete all existing dimensions
    console.log('Deleting existing dimensions...');
    const existingDocs = await getDocs(collection(db, 'dimensions'));
    for (const docSnap of existingDocs.docs) {
      await deleteDoc(doc(db, 'dimensions', docSnap.id));
    }
    console.log(`  ✓ Deleted ${existingDocs.size} existing dimensions`);
    
    // Step 2: Add new dimensions with correct order
    console.log('Adding new dimensions...');
    const batch = writeBatch(db);
    
    DIMENSIONS.forEach((dimension, index) => {
      const docRef = doc(collection(db, 'dimensions'));
      batch.set(docRef, { ...dimension, order: index });
    });
    
    await batch.commit();
    console.log(`  ✓ Added ${DIMENSIONS.length} dimensions with new order`);
    
    console.log('\n✅ Dimensions reseeded successfully!');
    console.log('   Refresh your browser (Ctrl+Shift+R in Edge) to see the changes.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Reseed failed:', error);
    process.exit(1);
  }
}

reseedDimensions();
