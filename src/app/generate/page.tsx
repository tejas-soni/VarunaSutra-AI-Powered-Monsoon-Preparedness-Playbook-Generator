'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDIAN_STATES, STATE_DISTRICTS, BLOOD_GROUPS, RELATIONSHIPS } from '@/lib/constants';
import type { PlaybookInput, FamilyMember, Gender, HousingType, FloorLevel, WaterBody, FloodExperience, SupportedLang } from '@/lib/types';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const ArrayInput = ({ value, onChange, placeholder }: { value: string[], onChange: (v: string[]) => void, placeholder: string }) => {
  const [text, setText] = React.useState(value.join(', '));
  return (
    <input 
      type="text" 
      placeholder={placeholder}
      value={text} 
      onChange={e => {
        setText(e.target.value);
        onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
      }} 
      className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700" 
    />
  );
};

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [input, setInput] = useState<PlaybookInput>({
    familyMembers: [
      { name: '', age: 30, gender: 'male', relationship: 'Self', medicalConditions: [], medications: [], allergies: [], specialEquipment: [], bloodGroup: 'Unknown' }
    ],
    location: {
      state: 'Maharashtra', district: 'Mumbai', city: '', pincode: '',
      housingType: 'apartment', floorLevel: 'above', nearbyWaterBodies: []
    },
    preferences: {
      language: 'en', hasPets: false, petType: '', petCount: 0,
      floodExperience: 'none', budget: 0, specificConcerns: ''
    }
  });

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: any) => {
    const members = [...input.familyMembers];
    members[index] = { ...members[index], [field]: value };
    setInput({ ...input, familyMembers: members });
  };

  const addFamilyMember = () => {
    if (input.familyMembers.length >= 15) return;
    setInput({
      ...input,
      familyMembers: [...input.familyMembers, { name: '', age: 30, gender: 'male', relationship: 'Other', medicalConditions: [], medications: [], allergies: [], specialEquipment: [], bloodGroup: 'Unknown' }]
    });
  };

  const removeFamilyMember = (index: number) => {
    if (input.familyMembers.length <= 1) return;
    const members = [...input.familyMembers];
    members.splice(index, 1);
    setInput({ ...input, familyMembers: members });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!res.ok) throw new Error('Failed to generate playbook');
      
      const playbook = await res.json();
      sessionStorage.setItem('varunasutra_playbook', JSON.stringify(playbook));
      router.push('/playbook');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 md:p-8">
        
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Your Playbook</h1>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-primary-light' : 'bg-slate-200 dark:bg-slate-700'}`} />
            ))}
          </div>
          <p className="mt-2 text-muted dark:text-slate-400 font-medium">Step {step} of 4</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Family Details</h2>
              {input.familyMembers.map((member, index) => (
                <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg relative">
                  {index > 0 && (
                    <button type="button" onClick={() => removeFamilyMember(index)} className="absolute top-2 right-2 text-red-500 text-sm font-bold">Remove</button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Name</label>
                      <input required type="text" value={member.name} onChange={e => updateFamilyMember(index, 'name', e.target.value)} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Age</label>
                      <input required type="number" min="0" max="120" value={member.age} onChange={e => updateFamilyMember(index, 'age', parseInt(e.target.value))} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Gender</label>
                      <select value={member.gender} onChange={e => updateFamilyMember(index, 'gender', e.target.value as Gender)} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Relationship</label>
                      <select value={member.relationship} onChange={e => updateFamilyMember(index, 'relationship', e.target.value)} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {input.familyMembers.length < 15 && (
                <button type="button" onClick={addFamilyMember} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition">+ Add Member</button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Location & Housing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">State</label>
                  <select value={input.location.state} onChange={e => setInput({ ...input, location: { ...input.location, state: e.target.value, district: STATE_DISTRICTS[e.target.value]?.[0] || '' } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">District</label>
                  <select value={input.location.district} onChange={e => setInput({ ...input, location: { ...input.location, district: e.target.value } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                    {(STATE_DISTRICTS[input.location.state] || []).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">City / Town</label>
                  <input required type="text" value={input.location.city} onChange={e => setInput({ ...input, location: { ...input.location, city: e.target.value } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Pincode</label>
                  <input required type="text" pattern="[1-9][0-9]{5}" value={input.location.pincode} onChange={e => setInput({ ...input, location: { ...input.location, pincode: e.target.value } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700" placeholder="e.g. 400001" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Housing Type</label>
                  <select value={input.location.housingType} onChange={e => setInput({ ...input, location: { ...input.location, housingType: e.target.value as HousingType } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                    <option value="apartment">Apartment</option>
                    <option value="independent">Independent House</option>
                    <option value="slum">Slum</option>
                    <option value="kutcha">Kutcha House</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Floor Level</label>
                  <select value={input.location.floorLevel} onChange={e => setInput({ ...input, location: { ...input.location, floorLevel: e.target.value as FloorLevel } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                    <option value="ground">Ground Floor</option>
                    <option value="above">Above Ground Floor</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">Nearby Water Bodies</label>
                  <div className="flex gap-4 flex-wrap">
                    {['river', 'lake', 'sea', 'nullah'].map((wb) => (
                      <label key={wb} className="flex items-center gap-2">
                        <input type="checkbox" checked={input.location.nearbyWaterBodies.includes(wb as WaterBody)} onChange={(e) => {
                          let arr = [...input.location.nearbyWaterBodies];
                          if (e.target.checked) arr.push(wb as WaterBody);
                          else arr = arr.filter(w => w !== wb);
                          setInput({ ...input, location: { ...input.location, nearbyWaterBodies: arr } });
                        }} />
                        <span className="capitalize">{wb}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Medical & Special Needs</h2>
              <p className="text-sm text-slate-500 mb-4">Leave fields empty if not applicable.</p>
              {input.familyMembers.map((member, index) => (
                <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{member.name || `Member ${index + 1}`}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Medical Conditions</label>
                      <ArrayInput value={member.medicalConditions} onChange={v => updateFamilyMember(index, 'medicalConditions', v)} placeholder="e.g. Diabetes, Asthma" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Medications</label>
                      <ArrayInput value={member.medications} onChange={v => updateFamilyMember(index, 'medications', v)} placeholder="e.g. Insulin" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Allergies</label>
                      <ArrayInput value={member.allergies} onChange={v => updateFamilyMember(index, 'allergies', v)} placeholder="e.g. Penicillin" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Special Equipment</label>
                      <ArrayInput value={member.specialEquipment} onChange={v => updateFamilyMember(index, 'specialEquipment', v)} placeholder="e.g. Wheelchair, Oxygen" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Blood Group</label>
                      <select value={member.bloodGroup} onChange={e => updateFamilyMember(index, 'bloodGroup', e.target.value)} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Playbook Language</label>
                  <select value={input.preferences.language} onChange={e => setInput({ ...input, preferences: { ...input.preferences, language: e.target.value as SupportedLang } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="kn">Kannada</option>
                    <option value="ml">Malayalam</option>
                    <option value="gu">Gujarati</option>
                    <option value="or">Odia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Flood Experience</label>
                  <select value={input.preferences.floodExperience} onChange={e => setInput({ ...input, preferences: { ...input.preferences, floodExperience: e.target.value as FloodExperience } })} className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700">
                    <option value="none">None</option>
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-2 font-bold text-sm">
                    <input type="checkbox" checked={input.preferences.hasPets} onChange={e => setInput({ ...input, preferences: { ...input.preferences, hasPets: e.target.checked } })} />
                    We have pets
                  </label>
                  {input.preferences.hasPets && (
                    <>
                      <input type="number" min="1" placeholder="Count" value={input.preferences.petCount} onChange={e => setInput({ ...input, preferences: { ...input.preferences, petCount: parseInt(e.target.value) || 0 } })} className="w-20 p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
                      <input type="text" placeholder="e.g. Dog, Cat" value={input.preferences.petType} onChange={e => setInput({ ...input, preferences: { ...input.preferences, petType: e.target.value } })} className="flex-1 p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
                    </>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">Preparedness Budget (₹)</label>
                  <input type="range" min="0" max="10000" step="500" value={input.preferences.budget} onChange={e => setInput({ ...input, preferences: { ...input.preferences, budget: parseInt(e.target.value) } })} className="w-full" />
                  <p className="text-sm text-slate-500 mt-1">{input.preferences.budget === 0 ? 'Not specified' : `₹${input.preferences.budget}`}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">Specific Concerns (Optional)</label>
                  <textarea rows={3} value={input.preferences.specificConcerns} onChange={e => setInput({ ...input, preferences: { ...input.preferences, specificConcerns: e.target.value } })} placeholder="e.g. We live near an open drain, power cuts last for days..." className="w-full p-2 rounded border dark:bg-slate-900 dark:border-slate-700" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-lg font-bold border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            ) : <div />}
            
            <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-bold bg-accent-orange hover:bg-orange-600 text-white transition flex items-center gap-2 shadow-lg disabled:opacity-70">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Crafting playbook...
                </>
              ) : step < 4 ? (
                <>
                  Next <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Generate Playbook <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
