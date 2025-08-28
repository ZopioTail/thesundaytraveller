'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPinIcon,
  CameraIcon,
  BookOpenIcon,
  GlobeAltIcon,
  TrophyIcon,
  AcademicCapIcon,
  HeartIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import CountUpAnimation from '@/components/ui/CountUpAnimation'

const achievements = [
  { icon: MapPinIcon, value: '47+', label: 'Countries Explored' },
  { icon: CameraIcon, value: '2.5K+', label: 'Photos Captured' },
  { icon: BookOpenIcon, value: '150+', label: 'Stories Written' },
  { icon: TrophyIcon, value: '12', label: 'Travel Awards' },
]

const timeline = [
  {
    year: '2018',
    title: 'The Journey Begins',
    description: 'Started my first solo backpacking trip across Southeast Asia, discovering my passion for travel photography and storytelling.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2019',
    title: 'First Travel Blog',
    description: 'Launched The Sunday Traveller blog, sharing authentic travel experiences and practical tips with fellow adventurers.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2020',
    title: 'Digital Nomad Life',
    description: 'Embraced remote work and became a full-time digital nomad, exploring 15 countries while building my online presence.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2021',
    title: 'Travel Photography Awards',
    description: 'Won multiple international travel photography competitions and started offering photography workshops.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2022',
    title: 'Published Travel Guide',
    description: 'Released my first comprehensive travel guide book, becoming a bestseller in the travel category.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    year: '2023',
    title: 'Global Recognition',
    description: 'Featured in major travel publications and invited as a keynote speaker at international travel conferences.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
]

export default function AboutPage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  return (
    <div className="overflow-hidden">
      {/* Parallax Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Travel landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 via-pink-500/80 to-purple-600/80" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/images/optimized/author-profile.jpg"
              alt="Vineet Kumar - The Sunday Traveller"
              width={160}
              height={160}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-2xl object-cover flex-shrink-0"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-6 text-shadow-lg"
          >
            The Sunday Traveller
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-shadow max-w-3xl mx-auto"
          >
            Passionate explorer, storyteller, and photographer sharing authentic travel experiences from around the globe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact" className="btn-primary">
              <EnvelopeIcon className="mr-2 icon-md" />
              Get in Touch
            </Link>
            <Link href="/book" className="btn-secondary">
              <BookOpenIcon className="mr-2 icon-md" />
              Read My Book
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Journey <span className="gradient-text">Achievements</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Every adventure has shaped my perspective and deepened my passion for exploring our incredible world.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="icon-xl text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My Travel <span className="gradient-text">Timeline</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From my first solo adventure to becoming a recognized travel expert, here's how my journey unfolded.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-pink-500 rounded-full" />

            <div className="space-y-16">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className="w-5/12">
                    <div className="card card-hover">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="card-body">
                        <div className="text-2xl font-bold text-orange-600 mb-2">
                          {item.year}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
                  </div>

                  {/* Spacer */}
                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why I Travel
              </h2>
              <div className="space-y-6 text-lg">
                <p>
                  Travel isn't just about visiting new places—it's about connecting with people, understanding different cultures, and discovering parts of yourself you never knew existed.
                </p>
                <p>
                  Every journey teaches me something new, whether it's learning to cook traditional dishes with local families, navigating ancient temples, or simply sharing stories with fellow travelers around a campfire.
                </p>
                <p>
                  Through my blog and photography, I aim to inspire others to step out of their comfort zones and experience the transformative power of travel.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/destinations" className="btn-secondary">
                  <MapPinIcon className="mr-2 icon-md" />
                  See My Destinations
                </Link>
                <Link href="/contact" className="btn-outline">
                  <HeartIcon className="mr-2 icon-md" />
                  Work Together
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src="/images/optimized/author-profile.jpg"
                  alt="Vineet Kumar - Travel Author"
                  width={600}
                  height={400}
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center text-orange-600 text-2xl font-bold shadow-xl">
                  6+
                  <span className="text-sm ml-1">Years</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Expertise & <span className="gradient-text">Specializations</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Years of travel experience have given me deep expertise in various aspects of exploration and storytelling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CameraIcon,
                title: 'Travel Photography',
                description: 'Award-winning photography capturing the essence of destinations and cultures worldwide.',
                skills: ['Landscape Photography', 'Portrait Photography', 'Street Photography', 'Drone Photography']
              },
              {
                icon: BookOpenIcon,
                title: 'Travel Writing',
                description: 'Compelling storytelling that brings destinations to life through authentic experiences.',
                skills: ['Blog Writing', 'Travel Guides', 'Cultural Articles', 'Photography Captions']
              },
              {
                icon: MapPinIcon,
                title: 'Destination Planning',
                description: 'Expert knowledge in creating unforgettable itineraries and finding hidden gems.',
                skills: ['Route Planning', 'Budget Optimization', 'Cultural Research', 'Safety Assessment']
              },
              {
                icon: GlobeAltIcon,
                title: 'Cultural Immersion',
                description: 'Deep understanding of local customs, traditions, and authentic cultural experiences.',
                skills: ['Language Learning', 'Local Customs', 'Traditional Crafts', 'Culinary Experiences']
              },
              {
                icon: AcademicCapIcon,
                title: 'Travel Education',
                description: 'Teaching others through workshops, courses, and personalized travel consultations.',
                skills: ['Photography Workshops', 'Travel Planning', 'Cultural Sensitivity', 'Safety Training']
              },
              {
                icon: TrophyIcon,
                title: 'Adventure Sports',
                description: 'Experienced in various adventure activities and extreme sports around the world.',
                skills: ['Rock Climbing', 'Scuba Diving', 'Hiking & Trekking', 'Water Sports']
              },
            ].map((expertise, index) => {
              const Icon = expertise.icon
              return (
                <motion.div
                  key={expertise.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card card-hover"
                >
                  <div className="card-body text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full mb-4">
                      <Icon className="icon-xl text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {expertise.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {expertise.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {expertise.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Explore Together
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Ready to plan your next adventure? I'd love to help you create unforgettable travel experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <EnvelopeIcon className="mr-2 icon-md" />
                Start Planning
              </Link>
              <Link href="/destinations" className="btn-outline">
                <GlobeAltIcon className="mr-2 icon-md" />
                Browse Destinations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
