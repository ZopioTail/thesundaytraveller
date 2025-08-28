
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import News from './pages/News';
import Destinations from './pages/Destinations';
import Book from './pages/Book';
import Certificates from './pages/Certificates';
import Adventure from './pages/Adventure';
import Lifestyle from './pages/Lifestyle';
import Profession from './pages/Profession';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <main className="pt-20">
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
