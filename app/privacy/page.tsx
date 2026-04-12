export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: January 15, 2024</p>
        <div className="space-y-6">
          {[
            ['Information We Collect', 'We collect information you provide directly to us, such as customer names, phone numbers, and transaction amounts that you add to your ledger.'],
            ['How We Use Information', 'We use the information to provide, maintain, and improve the service. We do not sell or share your personal information with third parties.'],
            ['Data Security', 'We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.'],
            ['Data Retention', 'We retain your data for as long as your account is active. You can request deletion at any time.'],
            ['Your Rights', 'You have the right to access, update, or delete your personal information at any time through the app settings.'],
            ['Cookies', 'We use minimal cookies only for essential functionality such as maintaining your session and preferences.'],
            ['Contact Us', 'If you have questions about this Privacy Policy, contact us at privacy@guptapaperstores.com.'],
          ].map(([title, content]) => (
            <div key={String(title)} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
