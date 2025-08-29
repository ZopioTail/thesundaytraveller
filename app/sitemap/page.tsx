import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap | The Sunday Traveller',
  description: 'Site navigation and page directory for The Sunday Traveller.',
}

const sitePages = [
  { name: 'Home', href: '/', description: 'Welcome to The Sunday Traveller' },
  { name: 'About', href: '/about', description: 'Learn about Vineet Kumar and his journey' },
  { name: 'Blog', href: '/blog', description: 'Travel stories and experiences' },
  { name: 'Destinations', href: '/destinations', description: 'Explore amazing destinations' },
  { name: 'Gallery', href: '/gallery', description: 'Photo gallery from travels' },
  { name: 'Certificates', href: '/certificates', description: 'Professional certifications and achievements' },
  { name: 'Book', href: '/book', description: 'Published travel book' },
  { name: 'Contact', href: '/contact', description: 'Get in touch' },
  { name: 'Adventure', href: '/adventure', description: 'Adventure travel experiences' },
  { name: 'Culture', href: '/culture', description: 'Cultural experiences and insights' },
  { name: 'Travel', href: '/travel', description: 'General travel information' },
  { name: 'Lifestyle', href: '/lifestyle', description: 'Travel lifestyle content' },
  { name: 'Food & Lifestyle', href: '/food-lifestyle', description: 'Culinary adventures' },
  { name: 'Art & Lifestyle', href: '/art-lifestyle', description: 'Art and cultural lifestyle' },
  { name: 'Profession', href: '/profession', description: 'Professional background' },
  { name: 'News', href: '/news', description: 'Latest news and updates' },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Sitemap
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Navigate through all pages on The Sunday Traveller website.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sitePages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {page.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {page.description}
                  </p>
                  <span className="text-blue-600 dark:text-blue-400 text-sm">
                    {page.href}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
