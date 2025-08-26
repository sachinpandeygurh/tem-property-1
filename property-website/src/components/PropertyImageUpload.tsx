import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { colors, shadows, animations, variants } from '../theme';

export interface UploadedImage {
  uri: string;
  uploading: boolean;
  error?: string;
  imgClassifications?: string;
  url?: string;
  key?: string;
  accurencyPercent?: string;
}

interface PropertyImageUploadProps {
  onChange?: (imgs: UploadedImage[]) => void;
  images?: UploadedImage[];
  loading?: boolean;
  maxImages?: number;
}

const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({
  onChange,
  images = [],
  loading = false,
  maxImages = 15
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(images);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;

    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please login to upload images');
      return;
    }

    const user = JSON.parse(userData);
    setIsUploading(true);

    const MAX_CONCURRENT_UPLOADS = 3;
    let successfulUploads = 0;
    let failedUploads = 0;

    // Process images in batches
    for (let i = 0; i < files.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = Array.from(files).slice(i, i + MAX_CONCURRENT_UPLOADS);

      // Add all images in batch to uploading state
      batch.forEach(file => {
        const imageUrl = URL.createObjectURL(file);
        setUploadedImages(prev => [...prev, { 
          uri: imageUrl, 
          uploading: true,
          key: file.name 
        }]);
      });

      // Upload batch concurrently
      const uploadPromises = batch.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('userId', user.id);
          formData.append('forClassify', 'true');

          const response = await axios.post(
            'https://nextopson.com/api/v1/property/upload-property-images-with-rekognition',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const { url, key, imgClassifications, accurencyPercent } = response.data.data;
          
          setUploadedImages(prev => prev.map(img =>
            img.key === file.name
              ? { 
                  ...img, 
                  uploading: false, 
                  error: undefined, 
                  url, 
                  key, 
                  imgClassifications, 
                  accurencyPercent 
                }
              : img
          ));
          
          return { success: true, fileName: file.name };
        } catch (err: any) {
          setUploadedImages(prev => prev.map(img =>
            img.key === file.name ? { ...img, uploading: false, error: 'Upload failed' } : img
          ));

          const errorMessage = err.response?.data?.message || err.message || 'Upload failed';
          console.error(`Failed to upload ${file.name}:`, errorMessage);
          return { success: false, fileName: file.name };
        }
      });

      // Wait for current batch to complete before processing next batch
      const results = await Promise.all(uploadPromises);
      
      // Count successes and failures
      results.forEach(result => {
        if (result.success) {
          successfulUploads++;
          console.log(`Image ${result.fileName} uploaded successfully!`);
        } else {
          failedUploads++;
        }
      });
    }

    setIsUploading(false);

    // Show summary if multiple images were uploaded
    if (files.length > 1) {
      const message = failedUploads > 0
        ? `${successfulUploads} out of ${files.length} images uploaded successfully. ${failedUploads} failed.`
        : `All ${successfulUploads} images uploaded successfully!`;
      
      alert(message);
    }
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleImageUpload(files);
    }
  }, [handleImageUpload]);

  const handleDelete = useCallback((uri: string, key?: string) => {
    setUploadedImages(prev => {
      const updated = prev.filter(img => img.uri !== uri);
      onChange?.(updated);
      return updated;
    });
    console.log('Image deleted successfully!');
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      handleImageUpload(files);
    }
  }, [handleImageUpload]);

  // Memoized values
  const uploadingCount = useMemo(() =>
    uploadedImages.filter(img => img.uploading).length,
    [uploadedImages]
  );

  const successfulImages = useMemo(() =>
    uploadedImages.filter(img => !img.uploading && !img.error && img.key),
    [uploadedImages]
  );

  const hasValidImages = useMemo(() =>
    successfulImages.length > 0,
    [successfulImages]
  );

  const canAddMoreImages = useMemo(() =>
    uploadedImages.length < maxImages,
    [uploadedImages.length, maxImages]
  );

  const isUserAvailable = useMemo(() => {
    const userData = localStorage.getItem('user');
    return !!userData;
  }, []);

  // Update parent component when images change
  React.useEffect(() => {
    if (onChange && uploadedImages.length > 0) {
      onChange(uploadedImages);
    }
  }, [uploadedImages, onChange]);

  return (
    <motion.div 
      className="space-y-6"
      variants={variants.springDrop}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animations.springDrop}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Property Images
        </h3>
        <span className="text-primary bg-gray-100 px-3 py-1 rounded-full text-sm">
          {uploadedImages.length} / {maxImages} images
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploadedImages.map((image, index) => (
          <div 
            key={image.uri || index} 
            className="relative group"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md">
              <img
                src={image.uri}
                alt={`Property ${index + 1}`}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  image.uploading ? 'opacity-50' : ''
                }`}
              />
              {image.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="spinner" />
                </div>
              )}
              {image.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30">
                  <span className="text-white text-xs text-center px-2 font-medium">
                    Upload Failed
                  </span>
                </div>
              )}
            </div>
            
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(image.uri, image.key)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white shadow-md"
            >
              ×
            </button>
            
            {/* Image Label */}
            <div className="mt-2 text-xs text-center px-2 py-1 rounded-lg bg-gray-100 text-gray-600">
              {image.imgClassifications || `Image ${index + 1}`}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      {canAddMoreImages && (
        <div className="upload-area">
          <label className="cursor-pointer block">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              disabled={isUploading || !isUserAvailable}
            />
            <div className="text-center">
              {isUploading ? (
                <span>
                  Uploading images...
                </span>
              ) : (
                <>
                  <span className="font-medium hover:underline transition-all duration-200 text-primary">
                    Click to upload
                  </span>
                  {' '}or drag and drop
                </>
              )}
            </div>
            <p className="text-xs mt-2 text-gray-500">
              PNG, JPG, GIF up to 10MB each
            </p>
          </label>
        </div>
      )}

      {/* Status Messages */}
      {!isUserAvailable && (
        <div className="alert alert-warning text-center">
          <p className="text-sm">
            Please login to upload images
          </p>
        </div>
      )}

      {!canAddMoreImages && (
        <div className="alert alert-error text-center">
          <p className="text-sm">
            Maximum {maxImages} images allowed
          </p>
        </div>
      )}

      {hasValidImages && (
        <div className="alert alert-success text-center">
          <p className="text-sm font-medium">
            ✓ {successfulImages.length} image{successfulImages.length > 1 ? 's' : ''} uploaded successfully
          </p>
        </div>
      )}

      {uploadingCount > 0 && (
        <div className="alert alert-info text-center">
          <p className="text-sm">
            Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
          </p>
        </div>
      )}

      {uploadedImages.length === 0 && !loading && (
        <div className="alert text-center bg-gray-100 border-gray-200">
          <p className="text-sm italic text-gray-500">
            No images uploaded yet. Please add at least one image.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyImageUpload; 