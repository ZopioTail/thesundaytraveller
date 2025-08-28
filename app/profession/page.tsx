'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ShieldCheckIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  TrophyIcon,
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export default function ProfessionPage() {
  const [activeTab, setActiveTab] = useState('military')

  const militaryExperience = [
    {
      rank: 'Captain',
      unit: 'Special Operations',
      duration: '2018-2023',
      location: 'Various Locations',
      achievements: [
        'Led 50+ successful operations',
        'Trained 200+ personnel',
        'Specialized in counter-terrorism',
        'Expert marksman certification'
      ]
    },
    {
      rank: 'Lieutenant',
      unit: 'Infantry Regiment',
      duration: '2015-2018',
      location: 'Northern Command',
      achievements: [
        'Platoon commander',
        'Combat leadership medal',
        'Tactical operations specialist',
        'Mentored junior officers'
      ]
    }
  ]

  const skills = [
    { name: 'Leadership', level: 95, icon: UserGroupIcon },
    { name: 'Strategic Planning', level: 90, icon: BriefcaseIcon },
    { name: 'Risk Assessment', level: 88, icon: ShieldCheckIcon },
    { name: 'Team Building', level: 92, icon: TrophyIcon },
    { name: 'Crisis Management', level: 85, icon: ClockIcon },
    { name: 'Training & Development', level: 90, icon: AcademicCapIcon },
  ]

  const certifications = [
    {
      title: 'Advanced Military Leadership',
      issuer: 'Defense Academy',
      year: '2022',
      description: 'Comprehensive leadership program for senior officers'
    },
    {
      title: 'Counter-Terrorism Operations',
      issuer: 'Special Forces Command',
      year: '2021',
      description: 'Specialized training in anti-terrorism tactics'
    },
    {
      title: 'Strategic Planning & Operations',
      issuer: 'Military Staff College',
      year: '2020',
      description: 'Advanced course in military strategy and planning'
    }
  ]

  const achievements = [
    {
      title: 'Gallantry Award',
      year: '2022',
      description: 'For exceptional courage during high-risk operations'
    },
    {
      title: 'Leadership Excellence Medal',
      year: '2021',
      description: 'Recognition for outstanding leadership and team performance'
    },
    {
      title: 'Service Medal',
      year: '2020',
      description: 'For distinguished service in challenging conditions'
    }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Military Professional"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-gray-900/80 to-green-900/80" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Professional Journey
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              From military service to civilian leadership - a story of dedication, growth, and continuous learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-1 shadow-lg">
              {[
                { id: 'military', label: 'Military Service', icon: ShieldCheckIcon },
                { id: 'skills', label: 'Skills & Expertise', icon: TrophyIcon },
                { id: 'achievements', label: 'Achievements', icon: StarIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Military Service Tab */}
          {activeTab === 'military' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Military <span className="gradient-text">Experience</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Eight years of dedicated service in the armed forces, developing leadership skills and tactical expertise.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {militaryExperience.map((experience, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="card"
                  >
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {experience.rank}
                          </h3>
                          <p className="text-lg text-gray-600 dark:text-gray-400">
                            {experience.unit}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mb-1">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {experience.duration}
                          </div>
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {experience.location}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          Key Achievements:
                        </h4>
                        <ul className="space-y-2">
                          {experience.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Skills & <span className="gradient-text">Expertise</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Core competencies developed through military training and real-world application.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card"
                  >
                    <div className="card-body">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                          <skill.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {skill.name}
                          </h3>
                          <div className="flex items-center mt-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="bg-gradient-to-r from-blue-500 to-green-600 h-2 rounded-full"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {skill.level}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-2xl font-bold text-center mb-8">
                  Professional <span className="gradient-text">Certifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="card"
                    >
                      <div className="card-body text-center">
                        <AcademicCapIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {cert.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {cert.issuer} • {cert.year}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {cert.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Awards & <span className="gradient-text">Recognition</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Recognition for exceptional service, leadership, and dedication to duty.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="card text-center"
                  >
                    <div className="card-body">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrophyIcon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {achievement.year}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="gradient-text">Connect?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Whether you're looking for leadership insights, military perspectives, or professional collaboration, I'm here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary">
                Get in Touch
              </a>
              <a href="/blog" className="btn-secondary">
                Read My Stories
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
