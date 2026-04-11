import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>

          <div className="space-y-6 text-gray-700">
            {[
              { title: '1. Information We Collect', content: `We collect information you provide (name, phone, business details), transaction data you enter, and technical information (device type, IP address) to provide and improve the ${APP_NAME} service.` },
              { title: '2. How We Use Your Information', content: 'We use your information to provide the service, send SMS reminders on your behalf, generate reports, improve our platform, and communicate important service updates.' },
              { title: '3. Data Storage & Security', content: 'All data is encrypted at rest and in transit using industry-standard AES-256 encryption. We store data on secure servers in India. We implement technical and organizational measures to protect your information.' },
              { title: '4. Data Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share data with SMS providers to send reminders on your behalf, and with legal authorities when required by law.' },
              { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time through your account settings or by contacting us. You can export your data at any time in PDF or CSV format.' },
              { title: '6. Cookies', content: 'We use essential cookies for authentication and to remember your session. We do not use tracking or advertising cookies.' },
              { title: '7. Children\'s Privacy', content: 'Our service is not directed to children under 13. We do not knowingly collect personal information from children.' },
              { title: '8. Contact', content: 'For privacy-related requests or questions, contact our Data Protection Officer at privacy@guptapaper.com.' },
            ].map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
