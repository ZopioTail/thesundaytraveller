# Assets Organization Guide

## Folder Structure

The assets are organized in the following structure under `public/assets/`:

```
public/assets/
├── images/
│   ├── blog/           # Blog post featured images and inline images
│   ├── news/           # News article images
│   ├── destinations/   # Destination photos and galleries
│   ├── gallery/        # General gallery images for homepage and other sections
│   └── avatars/        # User profile pictures and author photos
├── videos/             # Video content for posts and pages
└── documents/          # PDFs, guides, and other downloadable content
```

## File Naming Conventions

### Images
- **Blog Images**: `blog-[post-slug]-[number].jpg`
  - Example: `blog-adventure-sports-soldier-1.jpg`
- **News Images**: `news-[date]-[title-slug].jpg`
  - Example: `news-2025-08-28-travel-guidelines.jpg`
- **Destination Images**: `dest-[country-code]-[city-slug]-[number].jpg`
  - Example: `dest-pt-lisbon-1.jpg`
- **Gallery Images**: `gallery-[category]-[number].jpg`
  - Example: `gallery-mountains-1.jpg`
- **Avatars**: `avatar-[name-slug].jpg`
  - Example: `avatar-rabindra-sahu.jpg`

### Videos
- **Travel Videos**: `travel-[destination-slug]-[date].mp4`
  - Example: `travel-lisbon-portugal-2025-08.mp4`
- **Tutorial Videos**: `tutorial-[topic-slug].mp4`
  - Example: `tutorial-drone-photography.mp4`

### Documents
- **Guides**: `guide-[topic-slug].pdf`
  - Example: `guide-travel-photography.pdf`
- **Itineraries**: `itinerary-[destination-slug].pdf`
  - Example: `itinerary-portugal-7-days.pdf`

## Image Specifications

### Blog Featured Images
- **Dimensions**: 1200x630px (1.91:1 ratio)
- **Format**: JPG or WebP
- **Quality**: 80-85%
- **Max Size**: 200KB

### News Images
- **Dimensions**: 800x450px (16:9 ratio)
- **Format**: JPG or WebP
- **Quality**: 80%
- **Max Size**: 150KB

### Destination Images
- **Hero Images**: 1920x1080px (16:9 ratio)
- **Gallery Images**: 1200x800px (3:2 ratio)
- **Thumbnails**: 400x300px (4:3 ratio)
- **Format**: JPG or WebP
- **Quality**: 85-90%

### Avatar Images
- **Dimensions**: 400x400px (1:1 ratio)
- **Format**: JPG or WebP
- **Quality**: 90%
- **Max Size**: 100KB

## Upload Process

### Using the Admin Panel
1. Navigate to **Admin > Media**
2. Drag and drop files or click to browse
3. Files are automatically organized into appropriate folders
4. Add alt text and captions for SEO
5. Copy URLs for use in posts

### Manual Upload
1. Place files in the appropriate folder under `public/assets/`
2. Follow the naming conventions above
3. Optimize images before uploading
4. Update the media database through the admin panel

## SEO Best Practices

### Alt Text
- Descriptive and specific
- Include relevant keywords naturally
- Keep under 125 characters
- Example: "Rabindra Sahu trekking in the Himalayas during sunset"

### File Names
- Use descriptive, keyword-rich names
- Separate words with hyphens
- Keep under 60 characters
- Avoid special characters and spaces

### Image Optimization
- Compress images without losing quality
- Use WebP format when possible
- Implement lazy loading
- Provide multiple sizes for responsive design

## Content Categories and Their Assets

### Travel Category (formerly Adventure)
- **Folder**: `images/blog/travel/`
- **Content**: Travel experiences, destinations, itineraries
- **Image Style**: Landscape photography, cultural scenes, transportation

### Art & Lifestyle Category (formerly Culture)
- **Folder**: `images/blog/lifestyle/`
- **Content**: Personal stories, lifestyle tips, cultural experiences
- **Image Style**: Personal photos, lifestyle shots, cultural elements

### Profession Category (formerly Nature)
- **Folder**: `images/blog/profession/`
- **Content**: Military experiences, professional development, career insights
- **Image Style**: Professional photos, military scenes, training images

### Adventure Category (formerly Food)
- **Folder**: `images/blog/adventure/`
- **Content**: Extreme sports, outdoor activities, adventure travel
- **Image Style**: Action shots, outdoor activities, sports equipment

## Backup and Maintenance

### Regular Backups
- Weekly backup of all assets
- Store backups in cloud storage
- Maintain version history for important images

### File Cleanup
- Monthly review of unused files
- Remove outdated or low-quality images
- Optimize file sizes regularly

### Performance Monitoring
- Monitor page load times
- Check image loading performance
- Implement CDN for better delivery

## Integration with CMS

### Database References
- All uploaded files are tracked in the `media` table
- Includes metadata: alt text, captions, file size, upload date
- Automatic thumbnail generation for images

### Usage Tracking
- Track which files are used in posts
- Identify unused files for cleanup
- Monitor popular images for optimization

### API Endpoints
- `GET /api/media` - List all media files
- `POST /api/media/upload` - Upload new files
- `DELETE /api/media/:id` - Delete files
- `PUT /api/media/:id` - Update file metadata

## Troubleshooting

### Common Issues
1. **Large File Sizes**: Compress images before upload
2. **Slow Loading**: Implement lazy loading and WebP format
3. **Missing Images**: Check file paths and permissions
4. **SEO Issues**: Ensure proper alt text and file names

### File Size Limits
- Images: 10MB maximum
- Videos: 100MB maximum
- Documents: 25MB maximum

### Supported Formats
- **Images**: JPG, PNG, WebP, GIF, SVG
- **Videos**: MP4, WebM, MOV
- **Documents**: PDF, DOC, DOCX, TXT

## Future Enhancements

### Planned Features
- Automatic image optimization
- AI-powered alt text generation
- Advanced search and filtering
- Bulk operations
- Integration with external CDN
- Automatic backup to cloud storage

This guide will be updated as new features are added to the media management system.
