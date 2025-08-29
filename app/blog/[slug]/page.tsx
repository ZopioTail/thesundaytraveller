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
  HeartIcon,
  BookmarkIcon,
  EyeIcon,
  UserIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid'
import { getPostBySlug } from '@/lib/db'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  tags: string[]
  author: string
  publishedAt: Date
  readTime: number
  views: number
  likes: number
  difficulty?: string
  location?: string
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      try {
        const fetchedPost = await getPostBySlug(params.slug)
        if (!fetchedPost) {
          notFound()
        }
        setPost(fetchedPost)
      } catch (error) {
        console.error('Error fetching post:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <Link
          href="/blog"
          className="absolute top-8 left-8 z-20 flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white hover:bg-white/30 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Blog</span>
        </Link>

        {/* Post Meta */}
        <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-orange-500 px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              {post.difficulty && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {post.difficulty}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-shadow-lg">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4" />
                <span>{post.publishedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <EyeIcon className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
              {post.location && (
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{post.location}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between mb-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    liked
                      ? 'bg-red-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  {liked ? (
                    <HeartIconSolid className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{post.likes + (liked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    bookmarked
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {bookmarked ? (
                    <BookmarkIconSolid className="w-5 h-5" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                  <span>Save</span>
                </button>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
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
                {post.excerpt}
              </div>
              
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^/, '<p>').replace(/$/, '</p>').replace(/## (.*?)<br>/g, '<h2>$1</h2>').replace(/### (.*?)<br>/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
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
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
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
