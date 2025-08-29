import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | The Sunday Traveller',
  description: 'Privacy policy for The Sunday Traveller website.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We collect information you provide directly to us, such as when you contact us 
                or subscribe to our newsletter.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We use the information we collect to provide, maintain, and improve our services 
                and communicate with you.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you have any questions about this Privacy Policy, please contact us 
                through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
