import type { PlaybookInput, Playbook } from '@/lib/types';
import { classifyRisk } from '@/lib/risk/classify';
import { familyRiskScore, floodRiskScore } from '@/lib/risk/score';
import { vulnerabilityScore } from '@/lib/risk/vulnerability';

/**
 * Generate a complete playbook without AI (template-based local fallback).
 * This ensures the app always works offline or when rate-limited.
 */
export function generateFallback(input: PlaybookInput): Playbook {
  // 1. Calculate risk scores
  const floodScore = floodRiskScore({
    housingType: input.location.housingType,
    floorLevel: input.location.floorLevel,
    nearbyWaterBodies: input.location.nearbyWaterBodies,
    rainfallMm: 50, // default if no weather data
    warningColor: 'yellow', // default
  });

  const vulnScore = vulnerabilityScore(input.familyMembers);
  const overallScore = familyRiskScore(floodScore, vulnScore);
  const riskLevel = classifyRisk(overallScore);

  const markdownContent = `
## 1. 🏠 Your Monsoon Risk Profile
Based on your location in ${input.location.district} and housing type (${input.location.housingType}), your flood risk is **${riskLevel.toUpperCase()}**. Keep emergency supplies ready.

## 2. 📞 Emergency Contacts
- National Emergency: 112
- Ambulance: 108
- Local Police: 100

## 3. 🏃 Evacuation Plan
- Identify the highest point in your house.
- Keep important documents in a waterproof bag.
- Know the nearest relief camp.
`;

  // 2. Build local template sections
  return {
    title: 'Monsoon Preparedness Playbook',
    riskLevel,
    language: input.preferences.language,
    generatedAt: new Date().toISOString(),
    isAiEnriched: false,
    markdownContent,
    sections: [
      {
        id: 'risk-profile',
        title: 'Risk Profile',
        emoji: '🚨',
        content: `Based on your location in ${input.location.district} and housing type (${input.location.housingType}), your flood risk is **${riskLevel.toUpperCase()}**. Keep emergency supplies ready.`,
      },
      {
        id: 'emergency-contacts',
        title: 'Emergency Contacts',
        emoji: '📞',
        content: `- National Emergency: 112\n- Ambulance: 108\n- Local Police: 100`,
      },
      {
        id: 'evacuation-plan',
        title: 'Evacuation Plan',
        emoji: '🏃',
        content: `- Identify the highest point in your house.\n- Keep important documents in a waterproof bag.\n- Know the nearest relief camp.`,
      },
    ],
  };
}
