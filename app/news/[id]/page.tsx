'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  NewspaperIcon,
  EyeIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import {
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
} from '@heroicons/react/24/solid'

// Mock news data - in a real app, this would come from your database
const mockNews = [
  {
    id: '1',
    title: 'Military Tourism: Exploring Historical Battlefields Responsibly',
    excerpt: 'A growing trend in military tourism allows visitors to explore historical battlefields while honoring the sacrifices made. Learn about responsible battlefield tourism and its impact on local communities.',
    content: `Military tourism has emerged as a significant segment of the travel industry, offering visitors the opportunity to explore historical battlefields, military museums, and sites of strategic importance. This form of tourism goes beyond mere sightseeing; it provides educational experiences that honor the sacrifices made by military personnel throughout history.

## The Rise of Military Tourism

In recent years, there has been a notable increase in travelers seeking authentic historical experiences. Military tourism satisfies this demand by offering:

- **Educational Value**: Visitors gain insights into historical events, military strategies, and the human cost of conflict
- **Cultural Understanding**: These sites provide context for understanding different cultures and their histories
- **Memorial Significance**: They serve as places of remembrance and reflection

## Responsible Tourism Practices

When visiting military sites, it's crucial to approach them with respect and sensitivity:

### Before Your Visit
- Research the historical significance of the site
- Understand the cultural context and local customs
- Prepare mentally for potentially emotional experiences

### During Your Visit
- Maintain respectful behavior at all times
- Follow all posted guidelines and restrictions
- Consider hiring local guides to gain deeper insights
- Be mindful when taking photographs

### Supporting Local Communities
Military tourism can provide significant economic benefits to local communities:

- **Job Creation**: Tour guides, museum staff, and hospitality workers
- **Infrastructure Development**: Improved roads, facilities, and services
- **Cultural Preservation**: Funding for site maintenance and historical research

## Popular Military Tourism Destinations

Some of the world's most visited military tourism sites include:

1. **Normandy, France**: D-Day landing beaches and memorials
2. **Gettysburg, USA**: Civil War battlefield and national park
3. **Pearl Harbor, Hawaii**: Historic naval base and memorials
4. **Gallipoli, Turkey**: WWI battlefields and ANZAC memorials
5. **Berlin, Germany**: Cold War sites and museums

## The Impact on Veterans and Families

Military tourism sites often serve as pilgrimage destinations for veterans and military families. These visits can be:

- **Therapeutic**: Providing closure and healing
- **Educational**: Sharing experiences with younger generations
- **Commemorative**: Honoring fallen comrades and preserving memories

## Guidelines for Respectful Military Tourism

To ensure your visit contributes positively to the preservation of military history:

### Research and Preparation
- Study the historical context before visiting
- Understand the significance of specific locations
- Learn about appropriate behavior and dress codes

### On-Site Behavior
- Maintain a respectful demeanor
- Follow all rules and regulations
- Be considerate of other visitors, especially veterans and families
- Participate in ceremonies or moments of silence when appropriate

### Supporting Conservation
- Choose tour operators committed to site preservation
- Make donations to support maintenance and education programs
- Purchase from local businesses and artisans
- Spread awareness about the importance of these sites

## The Future of Military Tourism

As interest in historical travel continues to grow, military tourism faces both opportunities and challenges:

### Opportunities
- **Technology Integration**: Virtual reality and augmented reality experiences
- **Educational Programs**: Partnerships with schools and universities
- **International Cooperation**: Cross-border initiatives for shared historical sites

### Challenges
- **Site Preservation**: Balancing access with conservation needs
- **Sensitivity**: Managing the emotional impact on visitors
- **Authenticity**: Maintaining historical accuracy while making sites accessible

## Conclusion

Military tourism offers a unique opportunity to connect with history, honor sacrifices, and gain deeper understanding of our shared human experience. When approached with respect, preparation, and sensitivity, these visits can be transformative experiences that contribute to both personal growth and historical preservation.

By choosing to engage in responsible military tourism, travelers become part of a larger effort to preserve these important sites for future generations while supporting the communities that maintain them.`,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Military Tourism',
    type: 'guide',
    publishedAt: new Date('2025-08-28'),
    readTime: 6,
    tags: ['Military History', 'Battlefield Tourism', 'Responsible Travel', 'Heritage'],
    urgent: false,
    author: 'Vineet Kumar',
    views: 3247,
    trending: true,
    featured: true
  },
  {
    id: '2',
    title: 'Adventure Sports Safety: New International Guidelines Released',
    excerpt: 'International Adventure Sports Association releases updated safety guidelines for extreme sports tourism, focusing on risk management and emergency protocols.',
    content: `The International Adventure Sports Association (IASA) has released comprehensive new safety guidelines for extreme sports tourism, marking a significant step forward in risk management and emergency preparedness for adventure travel operators worldwide.

## Key Updates in the New Guidelines

The updated guidelines address several critical areas:

### Equipment Standards
- Enhanced certification requirements for safety equipment
- Regular inspection protocols for gear and facilities
- Standardized equipment replacement schedules

### Training Requirements
- Mandatory certification for all adventure sports instructors
- Annual safety training updates
- Emergency response training for all staff

### Risk Assessment Protocols
- Comprehensive pre-activity risk evaluations
- Weather monitoring and activity suspension criteria
- Participant health and fitness assessments

## Implementation Timeline

Adventure sports operators have 12 months to implement these new guidelines, with phased rollouts beginning immediately.

The guidelines are expected to significantly improve safety standards across the industry while maintaining the excitement and challenge that adventure sports enthusiasts seek.`,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Safety',
    type: 'alert',
    publishedAt: new Date('2025-08-26'),
    readTime: 5,
    tags: ['Adventure Sports', 'Safety Guidelines', 'Risk Management', 'Tourism'],
    urgent: true,
    author: 'Vineet Kumar',
    views: 1856,
    trending: false,
    featured: false
  }
]

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  type: 'guide' | 'alert' | 'update'
  publishedAt: Date
  readTime: number
  tags: string[]
  urgent: boolean
  author: string
  views: number
  trending?: boolean
  featured?: boolean
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from your database
    const foundArticle = mockNews.find(news => news.id === params.id)
    if (!foundArticle) {
      notFound()
    }
    setArticle(foundArticle)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!article) {
    notFound()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const getTypeIcon = () => {
    switch (article.type) {
      case 'alert':
        return <ExclamationTriangleIconSolid className="w-5 h-5" />
      case 'update':
        return <InformationCircleIconSolid className="w-5 h-5" />
      default:
        return <NewspaperIcon className="w-5 h-5" />
    }
  }

  const getTypeColor = () => {
    switch (article.type) {
      case 'alert':
        return 'bg-red-500'
      case 'update':
        return 'bg-blue-500'
      default:
        return 'bg-green-500'
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/news"
          className="absolute top-8 left-8 z-20 flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white hover:bg-white/30 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to News</span>
        </Link>

        {/* Article Meta */}
        <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <span className={`${getTypeColor()} px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2`}>
                {getTypeIcon()}
                <span>{article.category}</span>
              </span>
              {article.urgent && (
                <span className="bg-red-500 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  URGENT
                </span>
              )}
              {article.trending && (
                <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                  TRENDING
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-shadow-lg">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{article.publishedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeIcon className="w-4 h-4" />
                <span>{article.views.toLocaleString()} views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Share Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-end mb-8"
            >
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share Article</span>
              </button>
            </motion.div>

            {/* Article Body */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <div className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed">
                {article.excerpt}
              </div>
              
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ 
                  __html: article.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^/, '<p>').replace(/$/, '</p>').replace(/## (.*?)<br>/g, '<h2>$1</h2>').replace(/### (.*?)<br>/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                }}
              />
            </motion.article>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TagIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
