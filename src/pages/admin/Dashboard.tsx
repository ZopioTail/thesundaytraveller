import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalPosts: number;
  totalDestinations: number;
  totalCertificates: number;
  totalUsers: number;
  recentPosts: any[];
  recentSubmissions: any[];
}

export default function AdminDashboard() {
  const { userProfile, isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalDestinations: 0,
    totalCertificates: 0,
    totalUsers: 0,
    recentPosts: [],
    recentSubmissions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats (mock data for now)
      setStats({
        totalPosts: 47,
        totalDestinations: 47,
        totalCertificates: 8,
        totalUsers: 1250,
        recentPosts: [
          { id: 1, title: 'Hidden Gems of Southeast Asia', createdAt: new Date(), category: 'Travel' },
          { id: 2, title: 'Mountain Adventures in the Himalayas', createdAt: new Date(), category: 'Adventure' },
          { id: 3, title: 'Digital Nomad Life', createdAt: new Date(), category: 'Lifestyle' },
        ],
        recentSubmissions: [
          { id: 1, type: 'Contact', name: 'John Doe', createdAt: new Date() },
          { id: 2, type: 'Newsletter', email: 'jane@example.com', createdAt: new Date() },
          { id: 3, type: 'Book Order', name: 'Mike Smith', createdAt: new Date() },
        ],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/posts'
    },
    {
      title: 'Destinations',
      value: stats.totalDestinations,
      icon: GlobeAltIcon,
      color: 'from-green-500 to-green-600',
      href: '/admin/destinations'
    },
    {
      title: 'Certificates',
      value: stats.totalCertificates,
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/certificates'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/users'
    },
  ];

  return (
    <div className="min-h-screen section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {userProfile?.displayName}! Here's what's happening with your website.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-r ${card.color} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{card.title}</p>
                      <p className="text-3xl font-bold">{card.value.toLocaleString()}</p>
                    </div>
                    <Icon className="h-12 w-12 text-white/80" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Posts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                Recent Posts
              </h3>
              <button className="btn-primary text-sm">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Post
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{post.category}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Form Submissions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                Recent Submissions
              </h3>
              <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {submission.name || submission.email}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{submission.type}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {submission.createdAt.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'New Post', icon: DocumentTextIcon, href: '/admin/posts/new' },
            { label: 'Add Destination', icon: GlobeAltIcon, href: '/admin/destinations/new' },
            { label: 'Upload Certificate', icon: AcademicCapIcon, href: '/admin/certificates/new' },
            { label: 'View Analytics', icon: ChartBarIcon, href: '/admin/analytics' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:scale-105 group"
              >
                <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </p>
              </button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
