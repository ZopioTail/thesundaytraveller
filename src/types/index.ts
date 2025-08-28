export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'News' | 'Blog' | 'Adventure' | 'Lifestyle' | 'Profession' | 'Travel';
  tags: string[];
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  readTime: number;
  featured: boolean;
}

export interface Destination {
  id: string;
  name: string;
  region: 'North America' | 'Central America' | 'South America' | 'Europe' | 'Middle East' | 'Africa' | 'Central Asia' | 'SAARC' | 'Southeast Asia' | 'Miscellaneous';
  description: string;
  flagUrl: string;
  gallery: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  visited: boolean;
  visitDate?: Date;
}

export interface Book {
  id: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  purchaseLink: string;
  previewPages: string[];
  price: number;
  isbn: string;
  publishDate: Date;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  socials: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
  stats: {
    countriesVisited: number;
    milesTraveled: number;
    storiesWritten: number;
  };
}

export interface Certificate {
  id: string;
  title: string;
  year: number;
  issuer: string;
  country: string;
  flagUrl: string;
  fileUrl: string;
  description: string;
}

export interface JotformConfig {
  contactFormId: string;
  newsletterFormId: string;
  bookOrderFormId: string;
  feedbackFormId: string;
  certificateFormId: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: NavigationItem[];
}
