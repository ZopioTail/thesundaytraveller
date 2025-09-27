-- Create database
CREATE DATABASE IF NOT EXISTS thesundaytraveller;
USE thesundaytraveller;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar TEXT,
  bio TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX users_email_idx (email),
  INDEX users_username_idx (username),
  INDEX users_role_idx (role)
);

-- Create categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366f1',
  icon VARCHAR(50),
  parent_id INT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY categories_slug_unique (slug),
  INDEX categories_parent_idx (parent_id)
);

-- Create tags table
CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#10b981',
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY tags_slug_unique (slug),
  INDEX tags_name_idx (name)
);

-- Create posts table
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords TEXT,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  reading_time INT,
  difficulty VARCHAR(20),
  location VARCHAR(255),
  UNIQUE KEY posts_slug_unique (slug),
  INDEX posts_author_idx (author_id),
  INDEX posts_status_idx (status),
  INDEX posts_published_idx (published_at),
  INDEX posts_featured_idx (is_featured)
);

-- Create news table
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  is_breaking BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  view_count INT DEFAULT 0,
  UNIQUE KEY news_slug_unique (slug),
  INDEX news_author_idx (author_id),
  INDEX news_status_idx (status),
  INDEX news_published_idx (published_at)
);

-- Create destinations table
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  coordinates JSON,
  featured_image TEXT,
  images JSON,
  best_time_to_visit VARCHAR(255),
  currency VARCHAR(10),
  language VARCHAR(100),
  timezone VARCHAR(50),
  visa_info TEXT,
  author_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  seo_title VARCHAR(60),
  seo_description VARCHAR(160),
  seo_keywords TEXT,
  view_count INT DEFAULT 0,
  rating INT,
  UNIQUE KEY destinations_slug_unique (slug),
  INDEX destinations_author_idx (author_id),
  INDEX destinations_status_idx (status),
  INDEX destinations_country_idx (country)
);

-- Create media table
CREATE TABLE media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  width INT,
  height INT,
  alt TEXT,
  caption TEXT,
  folder VARCHAR(100) DEFAULT 'general',
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX media_filename_idx (filename),
  INDEX media_folder_idx (folder),
  INDEX media_uploader_idx (uploaded_by)
);

-- Create comments table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  author_website VARCHAR(255),
  post_id INT,
  news_id INT,
  parent_id INT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  is_anonymous BOOLEAN DEFAULT false,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX comments_post_idx (post_id),
  INDEX comments_news_idx (news_id),
  INDEX comments_parent_idx (parent_id),
  INDEX comments_status_idx (status)
);

-- Create newsletter_subscriptions table
CREATE TABLE newsletter_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscription_source VARCHAR(100) DEFAULT 'website',
  preferences JSON,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY newsletter_email_unique (email),
  INDEX newsletter_active_idx (is_active)
);

-- Create social_posts table
CREATE TABLE social_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  post_url TEXT,
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  engagement JSON,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX social_platform_idx (platform),
  INDEX social_status_idx (status),
  INDEX social_scheduled_idx (scheduled_at)
);

-- Create analytics table
CREATE TABLE analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_url TEXT NOT NULL,
  page_title VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT,
  session_id VARCHAR(255),
  user_id INT NOT NULL,
  device_type VARCHAR(20),
  browser VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX analytics_url_idx (page_url),
  INDEX analytics_session_idx (session_id),
  INDEX analytics_user_idx (user_id),
  INDEX analytics_timestamp_idx (timestamp)
);

-- Create settings table
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_name VARCHAR(100) NOT NULL UNIQUE,
  value JSON,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY settings_key_unique (key_name),
  INDEX settings_category_idx (category)
);

-- Create notifications table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  read_status BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSON,
  user_id INT NOT NULL,
  recipient_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX notifications_type_idx (type),
  INDEX notifications_priority_idx (priority),
  INDEX notifications_read_idx (read_status),
  INDEX notifications_recipient_idx (recipient_id),
  INDEX notifications_created_idx (created_at)
);

-- Create backups table
CREATE TABLE backups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  size INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX backups_status_idx (status),
  INDEX backups_type_idx (type)
);

-- Create junction tables
CREATE TABLE posts_to_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  UNIQUE KEY posts_to_categories_pk (post_id, category_id)
);

CREATE TABLE posts_to_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  UNIQUE KEY posts_to_tags_pk (post_id, tag_id)
);

CREATE TABLE news_to_categories (
  news_id INT NOT NULL,
  category_id INT NOT NULL,
  UNIQUE KEY news_to_categories_pk (news_id, category_id)
);

-- Add foreign key constraints
ALTER TABLE posts ADD CONSTRAINT posts_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES users(id);
ALTER TABLE news ADD CONSTRAINT news_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES users(id);
ALTER TABLE destinations ADD CONSTRAINT destinations_author_id_users_id_fk FOREIGN KEY (author_id) REFERENCES users(id);
ALTER TABLE media ADD CONSTRAINT media_uploaded_by_users_id_fk FOREIGN KEY (uploaded_by) REFERENCES users(id);
ALTER TABLE social_posts ADD CONSTRAINT social_posts_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE backups ADD CONSTRAINT backups_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE analytics ADD CONSTRAINT analytics_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE notifications ADD CONSTRAINT notifications_recipient_id_users_id_fk FOREIGN KEY (recipient_id) REFERENCES users(id);
ALTER TABLE categories ADD CONSTRAINT categories_parent_id_categories_id_fk FOREIGN KEY (parent_id) REFERENCES categories(id);
ALTER TABLE comments ADD CONSTRAINT comments_post_id_posts_id_fk FOREIGN KEY (post_id) REFERENCES posts(id);
ALTER TABLE comments ADD CONSTRAINT comments_news_id_news_id_fk FOREIGN KEY (news_id) REFERENCES news(id);
ALTER TABLE comments ADD CONSTRAINT comments_parent_id_comments_id_fk FOREIGN KEY (parent_id) REFERENCES comments(id);
ALTER TABLE posts_to_categories ADD CONSTRAINT posts_to_categories_post_id_posts_id_fk FOREIGN KEY (post_id) REFERENCES posts(id);
ALTER TABLE posts_to_categories ADD CONSTRAINT posts_to_categories_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE posts_to_tags ADD CONSTRAINT posts_to_tags_post_id_posts_id_fk FOREIGN KEY (post_id) REFERENCES posts(id);
ALTER TABLE posts_to_tags ADD CONSTRAINT posts_to_tags_tag_id_tags_id_fk FOREIGN KEY (tag_id) REFERENCES tags(id);
ALTER TABLE news_to_categories ADD CONSTRAINT news_to_categories_news_id_news_id_fk FOREIGN KEY (news_id) REFERENCES news(id);
ALTER TABLE news_to_categories ADD CONSTRAINT news_to_categories_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES categories(id);