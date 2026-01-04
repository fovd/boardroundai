import { PHIScoreResult } from './ResultsModal';

interface PHIPattern {
  category: string;
  description: string;
  weight: number;
  detect: (wordIndexToWordMap: Map<number, string>, highlightedIndices: Set<number>) => {
    detected: boolean;
    details: string;
    confidence: number; // 0-1, how strongly this pattern matches
  };
}

// Helper: Get word at index, handling edge cases
const getWord = (map: Map<number, string>, idx: number): string | null => {
  return map.get(idx) || null;
};

// Helper: Get normalized word (lowercase, punctuation removed for matching)
const normalizeWord = (word: string): string => {
  return word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
};

// Helper: Check if word matches (case-insensitive, punctuation-agnostic)
const wordMatches = (word1: string, word2: string): boolean => {
  return normalizeWord(word1) === normalizeWord(word2);
};

// Helper: Find word indices matching a pattern
const findWordIndices = (map: Map<number, string>, pattern: string): number[] => {
  const normalizedPattern = normalizeWord(pattern);
  const indices: number[] = [];
  map.forEach((word, idx) => {
    if (normalizeWord(word) === normalizedPattern) {
      indices.push(idx);
    }
  });
  return indices;
};

// Helper: Check if any of the given indices are highlighted
const anyHighlighted = (indices: number[], highlighted: Set<number>): boolean => {
  return indices.some(idx => highlighted.has(idx));
};

// Helper: Check if a capitalized name-like word (starts with capital, likely a name)
const isCapitalizedName = (word: string): boolean => {
  const cleaned = word.replace(/[.,;:!?'"()]/g, '');
  return /^[A-Z][a-z]+$/.test(cleaned) && cleaned.length > 2;
};

// Helper: Get all word indices in order
const getAllIndices = (map: Map<number, string>): number[] => {
  return Array.from(map.keys()).sort((a, b) => a - b);
};

// Pattern 1: Person Names (including titles + names)
const detectPersonNames: PHIPattern['detect'] = (map, highlighted) => {
  const nameWords = ['Elena', 'Volkov', 'Miller', 'James'];
  const titles = ['PC', 'SN', 'Dr', 'Mr', 'Ms', 'Mrs', 'Miss'];
  
  let detectedCount = 0;
  let details: string[] = [];
  
  // Check for known names
  nameWords.forEach(name => {
    const indices = findWordIndices(map, name);
    if (anyHighlighted(indices, highlighted)) {
      detectedCount++;
      // Check if title is also highlighted (co-occurrence)
      const nameIdx = indices[0];
      if (nameIdx !== undefined) {
        // Check 1-2 words before for titles
        for (let offset = 1; offset <= 2; offset++) {
          const titleWord = getWord(map, nameIdx - offset);
          if (titleWord && titles.some(t => wordMatches(titleWord, t))) {
            if (highlighted.has(nameIdx - offset)) {
              details.push(`${titleWord} ${name}`);
              break;
            }
          }
        }
        if (!details.some(d => d.includes(name))) {
          details.push(name);
        }
      }
    }
  });
  
  return {
    detected: detectedCount > 0,
    details: detectedCount > 0 ? details.join(', ') : '',
    confidence: detectedCount / nameWords.length,
  };
};

// Pattern 2: Patient Identifiers (co-occurrence: Baby + identifier components)
const detectPatientIdentifiers: PHIPattern['detect'] = (map, highlighted) => {
  const identifiers: { words: string[]; description: string }[] = [
    { words: ['Baby', "Boy", "'B'"], description: "Baby Boy 'B'" },
    { words: ['Twin', '2'], description: 'Twin 2' },
  ];
  
  let detectedCount = 0;
  const detectedGroups: string[] = [];
  
  identifiers.forEach(group => {
    const groupIndices = group.words.map(w => findWordIndices(map, w)).flat();
    const groupHighlighted = groupIndices.filter(idx => highlighted.has(idx));
    
    // Require at least 2 words from the group to be highlighted (co-occurrence)
    if (groupHighlighted.length >= 2) {
      detectedCount++;
      detectedGroups.push(group.description);
    } else if (groupHighlighted.length === 1 && group.words.length <= 2) {
      // Partial credit for smaller groups
      detectedCount += 0.5;
      detectedGroups.push(group.description + ' (partial)');
    }
  });
  
  return {
    detected: detectedCount > 0,
    details: detectedGroups.join(', '),
    confidence: Math.min(detectedCount / identifiers.length, 1),
  };
};

// Pattern 3: Locations (named places + specific ward identifiers)
const detectLocations: PHIPattern['detect'] = (map, highlighted) => {
  const namedPlaces = ['Warwick'];
  const specificLocations: { words: string[]; description: string }[] = [
    { words: ['Ward', '4'], description: 'Ward 4' },
  ];
  
  let detectedCount = 0;
  const detected: string[] = [];
  
  // Check named places
  namedPlaces.forEach(place => {
    const indices = findWordIndices(map, place);
    if (anyHighlighted(indices, highlighted)) {
      detectedCount++;
      detected.push(place);
    }
  });
  
  // Check specific location combinations
  specificLocations.forEach(loc => {
    const indices = loc.words.map(w => findWordIndices(map, w)).flat();
    const highlightedInLoc = indices.filter(idx => highlighted.has(idx));
    
    // Require all words to be highlighted (co-occurrence)
    if (highlightedInLoc.length === loc.words.length) {
      detectedCount++;
      detected.push(loc.description);
    }
  });
  
  return {
    detected: detectedCount > 0,
    details: detected.join(', '),
    confidence: detectedCount / (namedPlaces.length + specificLocations.length),
  };
};

// Pattern 4: Identifiers & Badge Numbers
const detectIdentifiers: PHIPattern['detect'] = (map, highlighted) => {
  const badgePatterns = ['#4492', '4492'];
  const identifierWords = ['Badge'];
  
  let detectedCount = 0;
  const detected: string[] = [];
  
  badgePatterns.forEach(pattern => {
    const indices = findWordIndices(map, pattern);
    if (anyHighlighted(indices, highlighted)) {
      detectedCount++;
      detected.push(pattern);
    }
  });
  
  // Check for Badge near a number (co-occurrence)
  identifierWords.forEach(word => {
    const indices = findWordIndices(map, word);
    indices.forEach(idx => {
      if (highlighted.has(idx)) {
        // Check if number nearby is also highlighted
        for (let offset = 1; offset <= 3; offset++) {
          const nearbyWord = getWord(map, idx + offset);
          if (nearbyWord && /#?\d+/.test(nearbyWord) && highlighted.has(idx + offset)) {
            detectedCount++;
            detected.push(`${word} ${nearbyWord}`);
            return;
          }
        }
      }
    });
  });
  
  return {
    detected: detectedCount > 0,
    details: [...new Set(detected)].join(', '),
    confidence: Math.min(detectedCount / 2, 1), // Normalize to 0-1
  };
};

// Pattern 5: Sensitive Status (Refugee, Immigration)
const detectSensitiveStatus: PHIPattern['detect'] = (map, highlighted) => {
  const statusWords = ['Refugee', 'status'];
  
  const indices = statusWords.map(w => findWordIndices(map, w)).flat();
  const highlightedCount = indices.filter(idx => highlighted.has(idx)).length;
  
  // Both words should be highlighted for full credit
  const confidence = highlightedCount / statusWords.length;
  
  return {
    detected: highlightedCount > 0,
    details: highlightedCount === statusWords.length ? 'Refugee status' : 'Refugee status (partial)',
    confidence,
  };
};

// Pattern 6: Law Enforcement & Safeguarding (NEW - first-class PHI)
const detectLawEnforcementSafeguarding: PHIPattern['detect'] = (map, highlighted) => {
  const enforcementPatterns: { words: string[]; description: string }[] = [
    { words: ['Police', 'Liaison', 'Officer'], description: 'Police Liaison Officer' },
    { words: ['PC', 'Miller'], description: 'PC Miller' },
  ];
  
  const safeguardingWords = ['Safeguarding'];
  const legalContextWords = ['distressed', 'requested', 'no', 'official', 'records'];
  
  let detectedCount = 0;
  const detected: string[] = [];
  
  // Check enforcement patterns (co-occurrence required)
  enforcementPatterns.forEach(pattern => {
    const indices = pattern.words.map(w => findWordIndices(map, w)).flat();
    const highlightedCount = indices.filter(idx => highlighted.has(idx)).length;
    
    if (highlightedCount >= 2) {
      detectedCount++;
      detected.push(pattern.description);
    }
  });
  
  // Check safeguarding keyword
  safeguardingWords.forEach(word => {
    const indices = findWordIndices(map, word);
    if (anyHighlighted(indices, highlighted)) {
      detectedCount++;
      detected.push(word);
    }
  });
  
  // Check for legal/privacy context (co-occurrence: "requested no official records")
  const legalIndices = legalContextWords.map(w => findWordIndices(map, w)).flat();
  const legalHighlighted = legalIndices.filter(idx => highlighted.has(idx));
  if (legalHighlighted.length >= 2) {
    detectedCount += 0.5;
    detected.push('Legal/privacy context');
  }
  
  return {
    detected: detectedCount > 0,
    details: detected.join(', '),
    confidence: Math.min(detectedCount / 3, 1),
  };
};

// Pattern 7: Physical Identifiers (as phrases, not individual words)
const detectPhysicalIdentifiers: PHIPattern['detect'] = (map, highlighted) => {
  // Define physical identifier phrases (grouped concepts)
  const physicalPhrases: { keywords: string[]; description: string }[] = [
    { keywords: ['Strawberry', 'birthmark'], description: 'Strawberry birthmark' },
    { keywords: ['birthmark', 'L-inner', 'thigh'], description: 'Birthmark on L-inner thigh' },
    { keywords: ['dimple', 'L-preauricular'], description: 'Dimple on L-preauricular area' },
    { keywords: ['dimple', 'ear'], description: 'Dimple near ear' },
  ];
  
  let detectedCount = 0;
  const detected: string[] = [];
  
  physicalPhrases.forEach(phrase => {
    const indices = phrase.keywords.map(w => findWordIndices(map, w)).flat();
    const highlightedCount = indices.filter(idx => highlighted.has(idx)).length;
    
    // Require at least 2 keywords to be highlighted (phrase detection)
    if (highlightedCount >= 2) {
      detectedCount++;
      detected.push(phrase.description);
    }
  });
  
  // Also check for "Unique Marker" context
  const markerWords = ['Unique', 'Marker'];
  const markerIndices = markerWords.map(w => findWordIndices(map, w)).flat();
  if (markerIndices.filter(idx => highlighted.has(idx)).length >= 1) {
    detectedCount += 0.5;
    detected.push('Unique marker context');
  }
  
  return {
    detected: detectedCount > 0,
    details: detected.join(', '),
    confidence: Math.min(detectedCount / physicalPhrases.length, 1),
  };
};

// Define PHI patterns with weights
const phiPatterns: PHIPattern[] = [
  {
    category: 'Person Names',
    description: 'Names of individuals (including titles + names)',
    weight: 20,
    detect: detectPersonNames,
  },
  {
    category: 'Patient Identifiers',
    description: 'Patient identifiers (combination identifiers)',
    weight: 15,
    detect: detectPatientIdentifiers,
  },
  {
    category: 'Law Enforcement & Safeguarding',
    description: 'Law enforcement contact, safeguarding flags, legal context',
    weight: 20,
    detect: detectLawEnforcementSafeguarding,
  },
  {
    category: 'Physical Identifiers',
    description: 'Unique physical markers that could identify the patient',
    weight: 15,
    detect: detectPhysicalIdentifiers,
  },
  {
    category: 'Sensitive Status',
    description: 'Sensitive personal status information (Refugee, Immigration)',
    weight: 10,
    detect: detectSensitiveStatus,
  },
  {
    category: 'Locations',
    description: 'Specific location information (named places, ward identifiers)',
    weight: 10,
    detect: detectLocations,
  },
  {
    category: 'Identifiers & Badge Numbers',
    description: 'Badge numbers and official identifiers',
    weight: 10,
    detect: detectIdentifiers,
  },
];

// Helper: Get specific missed items for a category
const getMissedItemsForCategory = (
  category: string,
  wordIndexToWordMap: Map<number, string>,
  highlightedIndices: Set<number>
): string[] => {
  const missed: string[] = [];
  
  switch (category) {
    case 'Person Names': {
      const nameWords = ['Elena', 'Volkov', 'Miller', 'James'];
      nameWords.forEach(name => {
        const indices = findWordIndices(wordIndexToWordMap, name);
        if (indices.length > 0 && !anyHighlighted(indices, highlightedIndices)) {
          missed.push(name);
        }
      });
      break;
    }
    case 'Patient Identifiers': {
      const identifiers: { words: string[]; description: string }[] = [
        { words: ['Baby', "Boy", "'B'"], description: "Baby Boy 'B'" },
        { words: ['Twin', '2'], description: 'Twin 2' },
      ];
      identifiers.forEach(group => {
        const groupIndices = group.words.map(w => findWordIndices(wordIndexToWordMap, w)).flat();
        const existsInText = group.words.every(w => findWordIndices(wordIndexToWordMap, w).length > 0);
        const groupHighlighted = groupIndices.filter(idx => highlightedIndices.has(idx));
        if (existsInText && groupHighlighted.length < 2) {
          missed.push(group.description);
        }
      });
      break;
    }
    case 'Locations': {
      const namedPlaces = ['Warwick'];
      namedPlaces.forEach(place => {
        const indices = findWordIndices(wordIndexToWordMap, place);
        if (indices.length > 0 && !anyHighlighted(indices, highlightedIndices)) {
          missed.push(place);
        }
      });
      const specificLocations: { words: string[]; description: string }[] = [
        { words: ['Ward', '4'], description: 'Ward 4' },
      ];
      specificLocations.forEach(loc => {
        const groupIndices = loc.words.map(w => findWordIndices(wordIndexToWordMap, w)).flat();
        const existsInText = loc.words.every(w => findWordIndices(wordIndexToWordMap, w).length > 0);
        const groupHighlighted = groupIndices.filter(idx => highlightedIndices.has(idx));
        if (existsInText && groupHighlighted.length < loc.words.length) {
          missed.push(loc.description);
        }
      });
      break;
    }
    case 'Identifiers & Badge Numbers': {
      const badgePatterns = ['#4492', '4492'];
      badgePatterns.forEach(pattern => {
        const indices = findWordIndices(wordIndexToWordMap, pattern);
        if (indices.length > 0 && !anyHighlighted(indices, highlightedIndices)) {
          missed.push(`Badge ${pattern}`);
        }
      });
      break;
    }
    case 'Sensitive Status': {
      const statusWords = ['Refugee', 'status'];
      const indices = statusWords.map(w => findWordIndices(wordIndexToWordMap, w)).flat();
      const existsInText = statusWords.some(w => findWordIndices(wordIndexToWordMap, w).length > 0);
      const highlightedCount = indices.filter(idx => highlightedIndices.has(idx)).length;
      if (existsInText && highlightedCount === 0) {
        missed.push('Refugee status');
      }
      break;
    }
    case 'Law Enforcement & Safeguarding': {
      const enforcementPatterns: { words: string[]; description: string }[] = [
        { words: ['Police', 'Liaison', 'Officer'], description: 'Police Liaison Officer' },
        { words: ['PC', 'Miller'], description: 'PC Miller' },
      ];
      enforcementPatterns.forEach(pattern => {
        const groupIndices = pattern.words.map(w => findWordIndices(wordIndexToWordMap, w)).flat();
        const existsInText = pattern.words.some(w => findWordIndices(wordIndexToWordMap, w).length > 0);
        const groupHighlighted = groupIndices.filter(idx => highlightedIndices.has(idx));
        if (existsInText && groupHighlighted.length < 2) {
          missed.push(pattern.description);
        }
      });
      const safeguardingWords = ['Safeguarding'];
      safeguardingWords.forEach(word => {
        const indices = findWordIndices(wordIndexToWordMap, word);
        if (indices.length > 0 && !anyHighlighted(indices, highlightedIndices)) {
          missed.push(word);
        }
      });
      break;
    }
    case 'Physical Identifiers': {
      const physicalPhrases: { keywords: string[]; description: string }[] = [
        { keywords: ['Strawberry', 'birthmark'], description: 'Strawberry birthmark' },
        { keywords: ['birthmark', 'L-inner', 'thigh'], description: 'Birthmark on L-inner thigh' },
        { keywords: ['dimple', 'L-preauricular'], description: 'Dimple on L-preauricular area' },
        { keywords: ['dimple', 'ear'], description: 'Dimple near ear' },
      ];
      physicalPhrases.forEach(phrase => {
        const groupIndices = phrase.keywords.map(w => findWordIndices(wordIndexToWordMap, w)).flat();
        const existsInText = phrase.keywords.some(w => findWordIndices(wordIndexToWordMap, w).length > 0);
        const groupHighlighted = groupIndices.filter(idx => highlightedIndices.has(idx));
        if (existsInText && groupHighlighted.length < 2) {
          missed.push(phrase.description);
        }
      });
      break;
    }
  }
  
  return missed;
};

// Calculate over-highlighting penalty (precision-based, not word-list based)
const calculateOverHighlightingPenalty = (
  highlightedIndices: Set<number>,
  wordIndexToWordMap: Map<number, string>,
  detectedPHICount: number
): { penalty: number; details: string } => {
  const totalWords = wordIndexToWordMap.size;
  const highlightedCount = highlightedIndices.size;
  
  if (totalWords === 0) {
    return { penalty: 0, details: '' };
  }
  
  const highlightRatio = highlightedCount / totalWords;
  
  // Penalize if more than 40% of text is highlighted (suggesting over-highlighting)
  if (highlightRatio > 0.4) {
    const excessRatio = (highlightRatio - 0.4) / 0.6; // Normalize excess to 0-1
    const penalty = Math.min(excessRatio * 15, 15); // Max 15 point penalty
    
    return {
      penalty,
      details: `Over-highlighting detected: ${Math.round(highlightRatio * 100)}% of text highlighted`,
    };
  }
  
  // Also check for highlighting entire sentences/paragraphs
  const indices = getAllIndices(wordIndexToWordMap);
  let consecutiveHighlighted = 0;
  let maxConsecutive = 0;
  
  indices.forEach(idx => {
    if (highlightedIndices.has(idx)) {
      consecutiveHighlighted++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveHighlighted);
    } else {
      consecutiveHighlighted = 0;
    }
  });
  
  // Penalize if more than 10 consecutive words are highlighted
  if (maxConsecutive > 10) {
    const excessConsecutive = maxConsecutive - 10;
    const penalty = Math.min((excessConsecutive / 10) * 5, 5); // Max 5 point penalty
    
    return {
      penalty: penalty,
      details: `Large blocks highlighted: ${maxConsecutive} consecutive words`,
    };
  }
  
  return { penalty: 0, details: '' };
};

export function calculatePHIScore(
  highlightedWordIndices: Set<number>,
  wordIndexToWordMap: Map<number, string>
): PHIScoreResult {
  // Run all PHI detection patterns
  const detectionResults = phiPatterns.map(pattern => ({
    pattern,
    result: pattern.detect(wordIndexToWordMap, highlightedWordIndices),
  }));
  
  // Calculate scores based on detection results
  let totalScore = 0;
  let totalWeight = 0;
  const identifiedPHI = new Set<string>();
  const missedPHI: string[] = [];
  
  detectionResults.forEach(({ pattern, result }) => {
    totalWeight += pattern.weight;
    
    if (result.detected) {
      // Use confidence to scale the score (0-1 confidence * weight)
      const categoryScore = result.confidence * pattern.weight;
      totalScore += categoryScore;
      
      if (result.details) {
        identifiedPHI.add(`${pattern.category}: ${result.details}`);
      }
    } else {
      // Get specific missed items for this category
      const specificMissed = getMissedItemsForCategory(
        pattern.category,
        wordIndexToWordMap,
        highlightedWordIndices
      );
      if (specificMissed.length > 0) {
        missedPHI.push(...specificMissed);
      } else {
        // Fallback to category name if no specific items found
        missedPHI.push(pattern.category);
      }
    }
  });
  
  // Calculate over-highlighting penalty
  const detectedPHICount = detectionResults.filter(r => r.result.detected).length;
  const overHighlighting = calculateOverHighlightingPenalty(
    highlightedWordIndices,
    wordIndexToWordMap,
    detectedPHICount
  );
  
  // Apply penalty to score
  const rawScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  const finalScore = Math.max(0, Math.round(rawScore - overHighlighting.penalty));
  
  // Determine tier
  let tier: PHIScoreResult['tier'];
  if (finalScore >= 90) {
    tier = 'Excellent';
  } else if (finalScore >= 70) {
    tier = 'Good';
  } else if (finalScore >= 50) {
    tier = 'Satisfactory';
  } else {
    tier = 'Needs Improvement';
  }
  
  // Generate feedback
  const feedback: string[] = [];
  const correctCount = identifiedPHI.size;
  
  if (finalScore >= 90) {
    feedback.push('Outstanding! You identified nearly all PHI elements. Excellent attention to detail in protecting patient privacy.');
  } else if (finalScore >= 70) {
    feedback.push('Good work! You identified most PHI elements. Review the missed items to improve your detection rate.');
  } else if (finalScore >= 50) {
    feedback.push('You identified some PHI elements, but several important identifiers were missed. Pay closer attention to names, locations, and unique identifiers.');
  } else {
    feedback.push('Several PHI elements were missed. Remember to look for names, locations, identifiers, and any information that could identify a specific patient.');
  }
  
  if (overHighlighting.penalty > 0) {
    feedback.push(`Note: ${overHighlighting.details}. Focus on identifying specific PHI elements, not large blocks of text.`);
  }
  
  if (missedPHI.length > 0 && missedPHI.length <= 3) {
    feedback.push(`Focus on identifying: ${missedPHI.slice(0, 3).join(', ')}.`);
  }
  
  // For incorrect highlights, we now use the over-highlighting detection
  // instead of a hardcoded word list
  const incorrectHighlights: string[] = [];
  if (overHighlighting.penalty > 0 && overHighlighting.details) {
    incorrectHighlights.push(overHighlighting.details);
  }
  
  return {
    score: finalScore,
    tier,
    correctIdentifications: correctCount,
    totalPHI: phiPatterns.length, // Count patterns, not words
    missedPHI: missedPHI.slice(0, 10),
    incorrectIdentifications: incorrectHighlights.slice(0, 10),
    feedback,
  };
}
