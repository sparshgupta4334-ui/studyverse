import Link from 'next/link';
import { BookOpen, Users, Target, Shield, Award, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: 'Rakesh Gupta', role: 'Founder & CEO', initial: 'R', desc: '20+ years in paper business. Started GPS to solve his own bookkeeping problems.' },
    { name: 'Preethi Sharma', role: 'CTO', initial: 'P', desc: 'IIT Delhi graduate. Built the entire platform from scratch with a focus on simplicity.' },
    { name: 'Vikram Singh', role: 'Head of Product', initial: 'V', desc: 'Ex-Paytm. Understands SME needs and translates them into great product features.' },
    { name: 'Divya Mehta', role: 'Customer Success', initial: 'D', desc: 'Ensures every business gets the most out of the platform. Speaks Hindi & English.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Gupta Paper Stores</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="/dashboard" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hamari Kahani</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gupta Paper Stores — ek chhote business owner ki zaroorat se janma, aaj 50,000+ businesses ki pehli pasand.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kaise Shuru Hua?</h2>
            <div className="space-y-4 text-gray-600">
              <p>2019 mein, Rakesh Gupta Delhi mein apna paper store chalate the. Har roz hath se khata likhna, customers ke due amounts yaad rakhna, aur payment reminders bhejne mein ghante lagte the.</p>
              <p>Ek din unka ek purana customer bhaag gaya bina poora paisa diye — kyunki Rakesh ji ke paas koi proper record nahi tha. Us din unhone decide kiya ki kuch karna hai.</p>
              <p>Aaj Gupta Paper Stores ek complete digital khata platform hai jo 50,000+ businesses use karte hain. Sab kuch FREE, simple aur reliable.</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="space-y-4">
              {[
                { year: '2019', event: 'Gupta Paper Stores ki neenv rakhi gayi' },
                { year: '2020', event: '1,000 businesses joined the platform' },
                { year: '2021', event: 'SMS reminder feature launch hua' },
                { year: '2022', event: '10,000 businesses aur UPI tracking' },
                { year: '2023', event: '50,000+ businesses, reports & analytics' },
                { year: '2024', event: 'Naya UI aur more features coming...' },
              ].map((e) => (
                <div key={e.year} className="flex items-start gap-4">
                  <span className="text-blue-600 font-bold text-sm w-10 flex-shrink-0">{e.year}</span>
                  <span className="text-gray-700 text-sm">{e.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Hamare Mulya (Our Values)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Simplicity First', desc: 'Every feature should be understandable by a first-time smartphone user. No complexity.', color: 'bg-blue-100 text-blue-600' },
              { icon: Shield, title: 'Data Security', desc: 'Your business data is yours. We never sell it, never misuse it. Bank-grade security always.', color: 'bg-green-100 text-green-600' },
              { icon: Award, title: 'Free Forever', desc: 'Small businesses should not pay for basic tools. GPS will always have a free tier.', color: 'bg-orange-100 text-orange-600' },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Hamari Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((m) => (
            <div key={m.name} className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">{m.initial}</span>
              </div>
              <h3 className="font-bold text-gray-900">{m.name}</h3>
              <p className="text-blue-600 text-sm mb-2">{m.role}</p>
              <p className="text-gray-500 text-xs">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Hamare Saath Judiye</h2>
        <p className="text-blue-200 mb-6">50,000+ businesses already use GPS. Aap kab aa rahe hain?</p>
        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50">
          Free Mein Shuru Karein <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center">
        <p className="text-sm">2024 Gupta Paper Stores. Made with love in India.</p>
      </footer>
    </div>
  );
}
