
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MapPinIcon,
  BookOpenIcon,
  CameraIcon,
  AcademicCapIcon,
  TrophyIcon,
  HeartIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { JotformButton } from '../components/forms/JotformEmbed';

const timelineEvents = [
  {
    year: 2018,
    title: 'The Journey Begins',
    description: 'Started my first solo backpacking trip across Southeast Asia, discovering my passion for travel writing.',
    flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    year: 2019,
    title: 'First Published Article',
    description: 'My first travel article was published in a major travel magazine, marking the beginning of my professional career.',
    flag: '📝',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    year: 2020,
    title: 'Digital Nomad Transition',
    description: 'Embraced the digital nomad lifestyle, learning to work remotely while exploring new destinations.',
    flag: '💻',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    year: 2021,
    title: 'Travel Photography Awards',
    description: 'Won several international travel photography competitions, expanding my creative horizons.',
    flag: '📸',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    year: 2022,
    title: 'Book Contract Signed',
    description: 'Signed my first book deal to compile my travel experiences into a comprehensive memoir.',
    flag: '📚',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    year: 2023,
    title: 'Global Recognition',
    description: 'Featured in major travel publications and invited to speak at international travel conferences.',
    flag: '🌟',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    year: 2024,
    title: 'The Sunday Traveller Launch',
    description: 'Launched this comprehensive platform to share stories, connect with fellow travelers, and inspire wanderlust.',
    flag: '🚀',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

const achievements = [
  { icon: MapPinIcon, label: 'Countries Visited', value: '47+' },
  { icon: BookOpenIcon, label: 'Articles Published', value: '234+' },
  { icon: CameraIcon, label: 'Photos Captured', value: '15K+' },
  { icon: TrophyIcon, label: 'Awards Won', value: '12' },
  { icon: AcademicCapIcon, label: 'Certifications', value: '8' },
  { icon: HeartIcon, label: 'Lives Inspired', value: '10K+' },
];

function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <div className="overflow-hidden">
      {/* Parallax Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-purple-600/80 to-pink-600/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Author Portrait"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              style={{ y: y2 }}
              className="mb-8"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="The Sunday Traveller"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-2xl object-cover"
              />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-shadow-lg">
              The Sunday Traveller
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-shadow opacity-90">
              Travel Author • Digital Nomad • Cultural Explorer
            </p>
            <blockquote className="text-lg md:text-xl italic mb-8 max-w-2xl mx-auto text-shadow opacity-80">
              "The world is a book, and those who do not travel read only one page."
            </blockquote>
            <JotformButton
              formType="contactFormId"
              title="Contact Me"
              description="I'd love to hear from you! Send me a message and I'll get back to you soon."
              buttonText="Get in Touch"
              buttonClassName="btn-primary"
              icon={EnvelopeIcon}
              height={500}
            />
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Achievements & Milestones
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A journey measured not just in miles, but in stories told and lives touched
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              My Journey Timeline
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From first steps to global recognition - the milestones that shaped my travel writing career
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full" />

            {/* Timeline Events */}
            <div className="space-y-16">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white dark:bg-gray-900 border-4 border-primary-500 rounded-full z-10" />

                  {/* Event Card */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="glass-card p-6 group hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">{event.flag}</span>
                        <div>
                          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {event.year}
                          </div>
                          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                      />

                      <p className="text-gray-600 dark:text-gray-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Highlights Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <blockquote className="text-2xl md:text-3xl font-serif italic mb-8 text-shadow">
              "Travel is not just about seeing new places; it's about seeing the world with new eyes,
              understanding different cultures, and discovering that despite our differences,
              we share the same hopes, dreams, and humanity."
            </blockquote>
            <cite className="text-lg opacity-90">— The Sunday Traveller</cite>
          </motion.div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                My Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  What started as a simple backpacking trip through Southeast Asia has evolved into a
                  life-changing journey of discovery, both external and internal. Over the past six years,
                  I've had the privilege of exploring 47 countries across 6 continents.
                </p>
                <p>
                  My approach to travel goes beyond the typical tourist experience. I believe in slow travel,
                  cultural immersion, and building genuine connections with local communities. This philosophy
                  has led to some of the most profound and transformative experiences of my life.
                </p>
                <p>
                  Through my writing, photography, and speaking engagements, I aim to inspire others to
                  step out of their comfort zones, embrace the unknown, and discover the incredible
                  diversity and beauty our world has to offer.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <JotformButton
                  formType="contactFormId"
                  title="Contact Me"
                  description="I'd love to hear from you! Send me a message and I'll get back to you soon."
                  buttonText="Contact Me"
                  buttonClassName="btn-primary"
                  icon={EnvelopeIcon}
                  height={500}
                />
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Download Resume
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Travel Author"
                  className="w-full rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                  6+
                  <span className="text-sm ml-1">Years</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default About;
