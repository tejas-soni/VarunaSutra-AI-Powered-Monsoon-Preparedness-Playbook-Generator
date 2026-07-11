import type { PlaybookInput, ImdForecast } from '@/lib/types';

export function buildPrompt(input: PlaybookInput, forecast: ImdForecast | null): { systemInstruction: string; userPrompt: string } {
  const systemInstruction = `You are VarunaSutra, an expert monsoon preparedness advisor for Indian families. You create comprehensive, practical, and personalized monsoon preparedness playbooks. You deeply understand Indian monsoon patterns, IMD warning systems (Yellow/Orange/Red alerts), Indian emergency numbers (112, 1077, 1070, 108), state disaster management authorities, and culturally appropriate safety practices for Indian households. Your output must be in well-structured Markdown format with clear sections, actionable checklists, and practical advice. Always prioritize safety.`;

  const memberList = input.familyMembers.map((m, i) => 
    `  - Member ${i + 1}: ${m.name}, Age ${m.age}, Gender: ${m.gender}, Rel: ${m.relationship}`
  ).join('\n');

  const conditionsList = input.familyMembers.map((m, i) => 
    `  - Member ${i + 1} (${m.name}): ${m.medicalConditions.length > 0 ? m.medicalConditions.join(', ') : 'None'}`
  ).join('\n');

  const medsList = input.familyMembers.map((m, i) => 
    `  - Member ${i + 1} (${m.name}): ${m.medications.length > 0 ? m.medications.join(', ') : 'None'}`
  ).join('\n');

  const needsList = input.familyMembers.map((m, i) => 
    `  - Member ${i + 1} (${m.name}): ${m.specialEquipment.length > 0 ? m.specialEquipment.join(', ') : 'None'}`
  ).join('\n');

  const forecastData = forecast 
    ? `IMD 5-day forecast for ${forecast.district}, ${forecast.state}:\n` + forecast.days.map(d => `- ${d.date}: ${d.description}, Rain: ${d.rainfallMm}mm, Warning: ${d.warningLevel}`).join('\n')
    : 'No specific forecast available. Provide general monsoon preparedness guidance.';

  const languageMap: Record<string, string> = {
    'en': 'English', 'hi': 'Hindi', 'mr': 'Marathi', 'bn': 'Bengali', 
    'ta': 'Tamil', 'te': 'Telugu', 'kn': 'Kannada', 'ml': 'Malayalam', 
    'gu': 'Gujarati', 'or': 'Odia'
  };
  const langName = languageMap[input.preferences.language] || 'English';

  const userPrompt = `
Generate a comprehensive monsoon preparedness playbook for this family:

FAMILY PROFILE:
- Location: ${input.location.city}, ${input.location.district}, ${input.location.state}, Pincode: ${input.location.pincode}
- Housing: ${input.location.housingType}, ${input.location.floorLevel} floor
- Nearby water bodies: ${input.location.nearbyWaterBodies.join(', ') || 'none'}
- Family members: ${input.familyMembers.length}
${memberList}
- Medical conditions:
${conditionsList}
- Medications:
${medsList}
- Special needs:
${needsList}
- Pets: ${input.preferences.hasPets ? `${input.preferences.petCount} x ${input.preferences.petType}` : 'None'}
- Previous flood experience: ${input.preferences.floodExperience}
- Budget: ${input.preferences.budget > 0 ? `₹${input.preferences.budget}` : 'Not specified'}
- Specific concerns: ${input.preferences.specificConcerns || 'None'}

CURRENT WEATHER FORECAST (IMD):
${forecastData}

LANGUAGE: ${langName} — generate entire playbook in this language

GENERATE THE PLAYBOOK WITH THESE EXACT SECTIONS:

## 1. 🏠 Your Monsoon Risk Profile
Based on the location, housing type, floor level, nearby water bodies, and current IMD forecast, assess the family's specific risk level. Mention IMD warning color codes if relevant. Be specific to their area.

## 2. ⏰ Preparation Timeline
- If severe weather is forecasted: Create a 72-hour countdown checklist (what to do 72h, 48h, 24h, and 6h before the event)
- If no severe weather: Create a weekly preparation schedule for the monsoon season

## 3. 👨👩👧👦 Family-Specific Safety Plan
For EACH family member, provide:
- Age-appropriate safety instructions
- Medical-specific precautions (based on their conditions)
- Assigned responsibilities (who does what during an emergency)
- Special evacuation considerations (elderly, infants, pregnant women, mobility-impaired members)

## 4. 📋 Emergency Checklist
A comprehensive, printable checklist with checkboxes:
- Documents to waterproof/ digitize (list specific Indian documents: Aadhaar, PAN, property papers, insurance, medical records)
- Emergency kit items (quantities based on family size)
- Medical supplies (based on family medical conditions)
- Cash reserve recommendation
- Contact list template
- Vehicle preparation (if applicable)

## 5. 🏃 Evacuation Plan
- When to evacuate (trigger conditions)
- What to carry (prioritized list: grab-and-go bag)
- Where to go (nearest safe zones — schools, community halls, higher ground)
- Evacuation route considerations (avoid low-lying roads, bridges)
- Pet evacuation plan (if applicable)

## 6. 🍚 Food & Water Stockpile
- 7-day food plan (Indian context: rice, dal, dry snacks, biscuits, ready-to-eat meals, ORS packets)
- Water storage and purification methods (boiling, chlorine tablets, ORS)
- Quantities calculated based on family size and ages
- Infant/elderly/medical-specific dietary needs
- Budget-conscious recommendations (respect user's budget if provided)

## 7. 🚗 Travel Advisory
- Monsoon travel safety tips specific to their area
- When to avoid travel (IMD warning color codes)
- Safe travel times and routes
- Public transport considerations (trains, buses)
- Vehicle emergency kit (if applicable)

## 8. 🏠 Home Protection Guide
- Pre-monsoon home maintenance checklist (specific to housing type)
- Waterproofing priority areas
- Electrical safety (elevation, cut-off switch location)
- Drainage and waterlogging prevention
- Valuables protection
- Structural safety assessment (if kutcha house or ground floor)

## 9. 📞 Emergency Contacts & Resources
- National Emergency: 112
- State Disaster Management Authority: (provide general guidance to find state number)
- Flood Helpline: 1070
- NDRF: 1077
- Ambulance: 108
- Nearest hospital recommendation (general guidance)
Format as a quick-reference card.

## 10. 🔄 During & After the Event
- Immediate actions when flooding/waterlogging starts
- When to switch off electricity and gas
- When to move to higher floor/evacuate
- Post-event safety: sanitation, mold prevention, water contamination, structural damage check
- Document and insurance claim steps
- Mental health support (especially for children and elderly)
- Community help and coordination

Make the entire output practical, specific to this family, and in ${langName} language. Use bullet points, checkboxes ([ ]), and bold text for emphasis. Do not include generic disclaimers — focus on actionable guidance.
`;

  return { systemInstruction, userPrompt };
}
