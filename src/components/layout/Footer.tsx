import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TwitterIcon,
} from '../icons/SocialIcons';
import { JotformButton } from '../forms/JotformEmbed';

const footerLinks = {
  explore: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Destinations', href: '/destinations' },
  ],
  content: [
    { name: 'Adventure', href: '/adventure' },
    { name: 'Lifestyle', href: '/lifestyle' },
    { name: 'Profession', href: '/profession' },
    { name: 'Book', href: '/book' },
  ],
  resources: [
    { name: 'Certificates', href: '/certificates' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: FacebookIcon },
  { name: 'Instagram', href: '#', icon: InstagramIcon },
  { name: 'YouTube', href: '#', icon: YoutubeIcon },
  { name: 'LinkedIn', href: '#', icon: LinkedinIcon },
  { name: 'Twitter', href: '#', icon: TwitterIcon },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container-custom section-padding py-12">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-serif font-bold mb-4">
                Join the Journey
              </h3>
              <p className="text-gray-400 mb-6">
                Subscribe to get the latest travel stories, tips, and adventures delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto">
                <JotformButton
                  formType="newsletterFormId"
                  title="Newsletter Subscription"
                  description="Subscribe to get the latest travel stories and tips"
                  buttonText="Subscribe to Newsletter"
                  buttonClassName="btn-primary w-full"
                  icon={EnvelopeIcon}
                  height={400}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <GlobeAltIcon className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-serif font-bold">
                The Sunday Traveller
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Exploring the world one story at a time. Join me on this incredible journey 
              of discovery, adventure, and cultural immersion across the globe.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>hello@sundaytraveller.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4" />
                <span>Currently exploring the world</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="container-custom section-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} The Sunday Traveller. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
