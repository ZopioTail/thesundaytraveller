import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | The Sunday Traveller',
  description: 'Terms of service for The Sunday Traveller website.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                By accessing and using this website, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Use License
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Permission is granted to temporarily download one copy of the materials on 
                The Sunday Traveller's website for personal, non-commercial transitory viewing only.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Disclaimer
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                The materials on The Sunday Traveller's website are provided on an 'as is' basis. 
                The Sunday Traveller makes no warranties, expressed or implied.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
