export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: January 15, 2024</p>
        <div className="prose dark:prose-invert max-w-none space-y-6">
          {[
            ['1. Acceptance of Terms', 'By accessing and using Gupta Paper Stores, you accept and agree to be bound by the terms and provision of this agreement.'],
            ['2. Use License', 'Permission is granted to temporarily use Gupta Paper Stores for personal, non-commercial business management purposes. This is the grant of a license, not a transfer of title.'],
            ['3. Free Service', 'Gupta Paper Stores is provided free of charge. We reserve the right to modify or discontinue any feature at any time.'],
            ['4. Data Ownership', 'You retain all rights to your business data. We do not claim ownership of any data you enter into the system.'],
            ['5. Privacy', 'Your privacy is important to us. Please review our Privacy Policy to understand our practices.'],
            ['6. Disclaimer', 'The materials on Gupta Paper Stores are provided on an as-is basis. We make no warranties, expressed or implied.'],
            ['7. Limitations', 'In no event shall Gupta Paper Stores or its suppliers be liable for any damages arising out of the use or inability to use the materials.'],
            ['8. Contact', 'If you have any questions about these Terms, please contact us at support@guptapaperstores.com.'],
          ].map(([title, content]) => (
            <div key={String(title)}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
