'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Printer, Download, RefreshCw, FileText } from 'lucide-react';
import type { Playbook } from '@/lib/types';

export default function PlaybookPage() {
  const router = useRouter();
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  
  useEffect(() => {
    const data = sessionStorage.getItem('varunasutra_playbook');
    if (data) {
      try {
        setPlaybook(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse playbook', e);
      }
    }
  }, []);

  if (!playbook) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-slate-700 dark:text-slate-300">Crafting your personalized playbook...</p>
        <button onClick={() => router.push('/generate')} className="mt-8 text-primary-light underline">Return to Generator</button>
      </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
      {/* Header bar - Hidden on print */}
      <div className="bg-primary text-white p-4 sticky top-0 z-10 shadow-md print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl font-bold truncate">VarunaSutra Playbook: {playbook.riskLevel.toUpperCase()} RISK</h1>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition font-medium">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={() => router.push('/generate')} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition font-medium">
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 p-4 md:p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg print:shadow-none print:p-0">
        {playbook.isAiEnriched ? (
          <div className="markdown-body prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:text-primary dark:prose-headings:text-primary-light prose-a:text-accent-orange prose-li:marker:text-primary-light">
            {playbook.markdownContent ? (
              <ReactMarkdown>{playbook.markdownContent}</ReactMarkdown>
            ) : (
              // Fallback if AI somehow returned the old JSON format
              playbook.sections?.map((s) => (
                <section key={s.id} className="mb-8">
                  <h2>{s.emoji} {s.title}</h2>
                  <ReactMarkdown>{s.content}</ReactMarkdown>
                </section>
              ))
            )}
          </div>
        ) : (
          <div className="markdown-body prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:text-primary dark:prose-headings:text-primary-light prose-a:text-accent-orange prose-li:marker:text-primary-light">
            <div className="p-4 mb-6 bg-yellow-100 text-yellow-900 border-l-4 border-yellow-500">
              <strong>Offline / Fallback Mode:</strong> The AI system is currently unavailable. This is a basic template playbook.
            </div>
            {playbook.markdownContent ? (
              <ReactMarkdown>{playbook.markdownContent}</ReactMarkdown>
            ) : (
              playbook.sections?.map((s) => (
                <section key={s.id} className="mb-8">
                  <h2>{s.emoji} {s.title}</h2>
                  <p>{s.content}</p>
                </section>
              ))
            )}
          </div>
        )}

        {/* Emergency Card for printing */}
        <div className="mt-16 border-4 border-primary rounded-xl p-6 page-break-before hidden print:block">
          <h2 className="text-2xl font-bold text-center mb-4 uppercase">Emergency Contact Card</h2>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div><strong>National Emergency:</strong> 112</div>
            <div><strong>Ambulance:</strong> 108</div>
            <div><strong>Flood Helpline:</strong> 1070</div>
            <div><strong>NDRF:</strong> 1077</div>
            <div><strong>Police:</strong> 100</div>
            <div><strong>Fire:</strong> 101</div>
          </div>
          <p className="mt-4 text-center font-bold">Keep this card in your waterproof grab-and-go bag.</p>
        </div>
      </div>
    </main>
  );
}
