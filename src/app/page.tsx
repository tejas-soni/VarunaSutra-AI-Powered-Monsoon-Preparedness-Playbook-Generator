import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  ShieldAlert, 
  MapPin, 
  HeartPulse, 
  Languages, 
  CloudLightning, 
  FileText 
} from 'lucide-react';

export default function Home() {
  const cards = [
    {
      title: 'Risk Assessment',
      description: 'Calculates specific flood and infrastructure risks based on your precise location and housing type.',
      icon: <MapPin className="w-8 h-8 text-accent-orange mb-4" aria-hidden="true" />,
    },
    {
      title: 'Vulnerability Scoring',
      description: 'Evaluates risks for elderly, infants, and members with high-risk medical conditions.',
      icon: <HeartPulse className="w-8 h-8 text-accent-red mb-4" aria-hidden="true" />,
    },
    {
      title: 'Live IMD Integration',
      description: 'Parses live alerts and rainfall forecasts from the India Meteorological Department.',
      icon: <CloudLightning className="w-8 h-8 text-primary-light mb-4" aria-hidden="true" />,
    },
    {
      title: '10-Language Support',
      description: 'Generates plans in English, Hindi, Marathi, Bengali, Tamil, Telugu, Kannada, and more.',
      icon: <Languages className="w-8 h-8 text-primary mb-4" aria-hidden="true" />,
    },
    {
      title: 'Offline Fallback',
      description: 'Generates a robust template-based playbook even when AI APIs are unavailable or rate-limited.',
      icon: <FileText className="w-8 h-8 text-muted mb-4" aria-hidden="true" />,
    },
    {
      title: 'Emergency Ready',
      description: 'Creates a printable, single-page emergency card to stick on your fridge for quick access.',
      icon: <ShieldAlert className="w-8 h-8 text-accent-orange mb-4" aria-hidden="true" />,
    },
  ];

  // Static rain drops for the background effect
  const rainDrops = Array.from({ length: 20 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${0.5 + Math.random() * 1.5}s`,
  }));

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
        {/* Animated Rain Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {rainDrops.map((style, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: style.left,
                animationDelay: style.animationDelay,
                animationDuration: style.animationDuration,
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Your Family's AI-Powered <br className="hidden md:block" />
            <span className="text-primary-light">Monsoon Preparedness</span> Playbook
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto mb-10">
            Generate a personalized, hyper-local action plan tailored to your family's 
            vulnerabilities, housing type, and live weather alerts. Don't wait for the storm—prepare now.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/generate"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-accent-orange rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-lg"
              role="button"
            >
              Generate Your Playbook
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why VarunaSutra is Built Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                {card.icon}
                <h3 className="text-xl font-bold mb-2 text-foreground">{card.title}</h3>
                <p className="text-muted leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
