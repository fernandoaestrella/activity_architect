export const DIMENSIONS = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ENGAGEMENT & FUN FACTORS (What makes activities enjoyable)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'flow', label: 'Flow Accessibility', description: 'Ease of entering an absorbed, timeless state' },
  { key: 'challenge', label: 'Challenge Alignment', description: 'Abilities vs requirements match' },
  { key: 'discovery', label: 'Discovery Amount', description: 'Potential to find new aspects' },
  { key: 'novelty', label: 'Novelty Seeking', description: 'Freshness and new experiences provided' },
  { key: 'risk', label: 'Risk/Thrill Level', description: 'Excitement from uncertainty or danger' },
  { key: 'interactivity', label: 'Interactivity', description: 'How immediately your actions affect the next moment-to-moment state; the tightness of the input-feedback loop' },
  { key: 'response', label: 'Response Intensity', description: 'Force of the activity\'s feedback' },
  { key: 'sensory_richness', label: 'Sensory Richness', description: 'Variety and depth of sensory stimulation' },
  { key: 'random', label: 'Randomicity', description: 'Prevalence of unpredictable elements' },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME & COMMITMENT (Practical scheduling concerns)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'duration', label: 'Session Duration', description: 'Typical length of a single engagement session' },
  { key: 'frequency', label: 'Engagement Frequency', description: 'How often the activity invites return participation' },
  { key: 'commitment', label: 'Commitment Level', description: 'Long-term investment required to see meaningful progress' },
  { key: 'barrier', label: 'Entry Barrier', description: 'Difficulty of starting as a complete beginner' },
  { key: 'cost', label: 'Financial Investment', description: 'Money required to participate' },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL ASPECTS (Connection with others)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'collaboration', label: 'Collaboration Depth', description: 'Degree of meaningful teamwork with others' },
  { key: 'competition', label: 'Competitive Intensity', description: 'Level of rivalry or ranking against others' },
  { key: 'mentorship', label: 'Teaching/Learning Ratio', description: 'Opportunities to guide others or be guided' },
  { key: 'audience', label: 'Audience Presence', description: 'Visibility or performance aspect to observers' },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHYSICAL & SENSORY (Body involvement)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'physical_exertion', label: 'Physical Exertion', description: 'Bodily effort and energy expenditure' },
  { key: 'tactile', label: 'Tactile Engagement', description: 'Hands-on, physical manipulation involved' },
  { key: 'spatial', label: 'Spatial Needs', description: 'Requirement of physical/simulated space' },
  { key: 'accessibility', label: 'Physical Accessibility', description: 'Accommodation for different physical abilities' },

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE & MENTAL (Mind involvement)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'cognitive_load', label: 'Cognitive Load', description: 'Mental effort and concentration required' },
  { key: 'mindfulness', label: 'Mindfulness Potential', description: 'Capacity to bring present-moment awareness' },
  { key: 'objective', label: 'Objective Clarity', description: 'How well defined the goals are' },
  { key: 'curve', label: 'Learning Curve', description: 'Steepness of skill progression' },
  { key: 'speed', label: 'Time Quantum (Speed)', description: 'Length of steps relative to time' },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTONOMY & AGENCY (Freedom and control)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'autonomy', label: 'Autonomy Level', description: 'Freedom to make independent choices' },
  { key: 'personalization', label: 'Personalization Depth', description: 'Ability to express your core self' },
  { key: 'avatar', label: 'Avatar Agency', description: 'Control over self-representation' },
  { key: 'consequence', label: 'Consequence Weight', description: 'How permanently decisions persist and affect long-term outcomes; the lasting stakes of your choices' },

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTCOMES & LONG-TERM VALUE (What you get from it)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'mastery', label: 'Mastery Ceiling', description: 'Ultimate depth of expertise attainable' },
  { key: 'utility', label: 'Real-World Utility', description: 'Practical applicability outside the activity' },
  { key: 'tangibility', label: 'Output Tangibility', description: 'Whether the activity produces concrete artifacts' },
  { key: 'legacy', label: 'Legacy Potential', description: 'Ability to leave lasting contributions' },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMOTIONAL & AFFECTIVE (Feelings and nostalgia)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'catharsis', label: 'Cathartic Release', description: 'Emotional processing and relief potential' },
  { key: 'nostalgia', label: 'Nostalgia Factor', description: 'Connection to familiar, comforting elements' },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHAKRA SYSTEM (Grouped - Spiritual/energetic dimensions)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'root_chakra', label: 'Root Chakra', description: 'Stability, security, and basic needs' },
  { key: 'sacral_chakra', label: 'Sacral Chakra', description: 'Creativity, sexuality, and emotions' },
  { key: 'solar_plexus_chakra', label: 'Solar Plexus Chakra', description: 'Self-worth, confidence, and power' },
  { key: 'heart_chakra', label: 'Heart Chakra', description: 'Love, compassion, and connection' },
  { key: 'throat_chakra', label: 'Throat Chakra', description: 'Communication, self-expression, and truth' },
  { key: 'third_eye_chakra', label: 'Third Eye Chakra', description: 'Intuition, imagination, and wisdom' },
  { key: 'crown_chakra', label: 'Crown Chakra', description: 'Spirituality, enlightenment, and transcendence' },

  // ═══════════════════════════════════════════════════════════════════════════
  // MASLOW'S HIERARCHY (Grouped at very bottom - Foundational needs)
  // ═══════════════════════════════════════════════════════════════════════════
  { key: 'physiological', label: 'Physiological Need', description: 'Supply of bodily/physical needs' },
  { key: 'safety', label: 'Safety & Security', description: 'Stability, protection, and freedom from fear' },
  { key: 'social', label: 'Social Belonging', description: 'Connection, intimacy, and sense of community' },
  { key: 'esteem', label: 'Esteem & Status', description: 'Respect, recognition, and self-worth' },
  { key: 'actualization', label: 'Self-Actualization', description: 'Growth, meaning, and transcendence' }
];
