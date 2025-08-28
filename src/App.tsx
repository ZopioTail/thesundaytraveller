
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingFallback from './components/LoadingFallback';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const News = lazy(() => import('./pages/News'));
const Destinations = lazy(() => import('./pages/Destinations'));
const Book = lazy(() => import('./pages/Book'));
const Certificates = lazy(() => import('./pages/Certificates'));
const Adventure = lazy(() => import('./pages/Adventure'));
const Lifestyle = lazy(() => import('./pages/Lifestyle'));
const Profession = lazy(() => import('./pages/Profession'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <main className="pt-20">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/book" element={<Book />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/adventure" element={<Adventure />} />
                  <Route path="/lifestyle" element={<Lifestyle />} />
                  <Route path="/profession" element={<Profession />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
