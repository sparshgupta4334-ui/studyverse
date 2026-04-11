import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            {[
              { title: '1. Acceptance of Terms', content: `By accessing and using ${APP_NAME}, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.` },
              { title: '2. Use of Service', content: `${APP_NAME} provides a digital ledger and business management platform. You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account credentials.` },
              { title: '3. User Data', content: 'You retain ownership of all data you enter into the platform. We process your data to provide the service and will not sell your personal information to third parties. Please refer to our Privacy Policy for complete details.' },
              { title: '4. Free Service', content: 'Our core service is provided free of charge. We reserve the right to introduce premium features in the future, but will always maintain a free tier with essential functionality.' },
              { title: '5. Disclaimers', content: 'The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access to the service and are not liable for any business losses arising from service unavailability.' },
              { title: '6. Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi, India.' },
              { title: '7. Changes to Terms', content: 'We may update these terms periodically. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of significant changes via email or in-app notification.' },
              { title: '8. Contact', content: `For questions about these terms, contact us at legal@guptapaper.com or write to us at our New Delhi office.` },
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
