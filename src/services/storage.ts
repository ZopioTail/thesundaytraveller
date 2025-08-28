import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export class StorageService {
  // Upload single file
  static async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const storageRef = ref(storage, path);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress({
              progress,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
            });
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  }

  // Upload multiple files
  static async uploadFiles(
    files: File[],
    basePath: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}-${file.name}`;
      const path = `${basePath}/${fileName}`;
      
      return this.uploadFile(
        file,
        path,
        onProgress ? (progress) => onProgress(index, progress) : undefined
      );
    });

    return Promise.all(uploadPromises);
  }

  // Delete file
  static async deleteFile(url: string): Promise<void> {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  }

  // Delete multiple files
  static async deleteFiles(urls: string[]): Promise<void> {
    const deletePromises = urls.map(url => this.deleteFile(url));
    await Promise.all(deletePromises);
  }

  // List files in directory
  static async listFiles(path: string): Promise<string[]> {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const urlPromises = result.items.map(item => getDownloadURL(item));
    return Promise.all(urlPromises);
  }

  // Generate optimized image path
  static generateImagePath(type: 'posts' | 'destinations' | 'certificates' | 'author' | 'book', fileName: string): string {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `images/${type}/${timestamp}-${cleanFileName}`;
  }

  // Validate file type and size
  static validateFile(file: File, options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
  } = {}): { valid: boolean; error?: string } {
    const { maxSize = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] } = options;

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${maxSize}MB. Current size: ${fileSizeMB.toFixed(2)}MB`,
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  // Compress image before upload
  static async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width)
        const maxWidth = 1920;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Batch operations
  static async batchUploadImages(
    files: File[],
    type: 'posts' | 'destinations' | 'certificates' | 'author' | 'book',
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file, index) => {
      // Validate file
      const validation = this.validateFile(file, { allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] });
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Compress image
      const compressedFile = await this.compressImage(file);
      
      // Generate path and upload
      const path = this.generateImagePath(type, file.name);
      return this.uploadFile(
        compressedFile,
        path,
        onProgress ? (progress) => onProgress(index, progress) : undefined
      );
    });

    return Promise.all(uploadPromises);
  }
}
