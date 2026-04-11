import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookOpen, Target, Heart, Users } from 'lucide-react';

const TEAM = [
  { name: 'Arjun Gupta', role: 'Founder & CEO', initials: 'AG' },
  { name: 'Priya Sharma', role: 'Head of Product', initials: 'PS' },
  { name: 'Rohit Verma', role: 'Lead Engineer', initials: 'RV' },
  { name: 'Sneha Patel', role: 'Customer Success', initials: 'SP' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <BookOpen className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold mb-4">About Gupta Paper Stores</h1>
            <p className="text-blue-100 text-lg">We help small and medium businesses across India manage their finances digitally — simply and for free.</p>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">Gupta Paper Stores started as a small stationery shop in New Delhi. Managing credit and debit in a physical khata was time-consuming and error-prone.</p>
                <p className="text-gray-600">We built this app to solve our own problem — and realized millions of Indian businesses face the same challenge. Today, we are proud to serve 10,000+ businesses across India.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, title: 'Our Mission', text: 'Make financial management accessible to every small business in India' },
                  { icon: Heart, title: 'Our Vision', text: 'A thriving ecosystem where every shopkeeper is empowered by technology' },
                  { icon: Users, title: 'Our Community', text: '10,000+ businesses across 500+ cities in India' },
                  { icon: BookOpen, title: 'Our Product', text: 'Simple, fast, and completely free digital ledger for your business' },
                ].map((v) => (
                  <div key={v.title} className="bg-blue-50 rounded-xl p-4">
                    <v.icon size={20} className="text-blue-700 mb-2" />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{v.title}</h3>
                    <p className="text-xs text-gray-500">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Meet Our Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TEAM.map((m) => (
                <div key={m.name} className="text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-700 text-white text-lg font-bold mx-auto flex items-center justify-center mb-3">{m.initials}</div>
                  <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
