import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press & Media | The Sunday Traveller',
  description: 'Press releases, media coverage, and news about The Sunday Traveller.',
}

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Press & Media
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Press and media information will be available soon. For media inquiries, 
              please contact us through our contact page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
