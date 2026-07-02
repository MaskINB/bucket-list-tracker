'use client';

import { useState, useEffect, useRef } from 'react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import Image from 'next/image';

interface ImageUploadProps {
  existingImageKey?: string | null;
  onImageUploaded: (imageKey: string) => void;
  onImageRemoved: () => void;
}

export default function ImageUpload({
  existingImageKey,
  onImageUploaded,
  onImageRemoved,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadExistingImage = async () => {
      if (existingImageKey) {
        try {
          const result = await getUrl({
            path: existingImageKey,
            options: { validateObjectExistence: false },
          });
          setImageUrl(result.url.toString());
        } catch {
          console.error('Failed to load existing image');
        }
      }
    };
    loadExistingImage();
  }, [existingImageKey]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const { identityId } = await fetchAuthSession();
      if (!identityId) {
        throw new Error('Unable to resolve your storage identity');
      }
      const fileExtension = file.name.split('.').pop();
      const timestamp = Date.now();
      const imageKey = `bucket-items/${identityId}/${timestamp}.${fileExtension}`;

      const uploadTask = uploadData({
        path: imageKey,
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes && totalBytes > 0) {
              const pct = Math.round((transferredBytes / totalBytes) * 100);
              setProgress(pct);
            }
          },
        },
      });

      await uploadTask.result;

      // Get signed URL for preview
      const urlResult = await getUrl({
        path: imageKey,
        options: { validateObjectExistence: false },
      });

      setImageUrl(urlResult.url.toString());
      onImageUploaded(imageKey);
    } catch (err: unknown) {
      console.error('Upload error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Upload failed — please try again');
      }
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (): Promise<void> => {
    if (!existingImageKey) return;
    if (!confirm('Remove this image?')) return;

    try {
      await remove({ path: existingImageKey });
      setImageUrl(null);
      onImageRemoved();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to remove image');
      }
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {imageUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          <Image
            src={imageUrl}
            alt="Bucket list item"
            width={400}
            height={200}
            className="w-full h-48 object-cover"
            unoptimized
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
            uploading
              ? 'border-blue-300 bg-blue-50 cursor-wait'
              : 'border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {uploading ? (
            <div className="space-y-2">
              <p className="text-sm text-blue-600 font-medium">
                Uploading... {progress}%
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-3xl mb-2">📷</p>
              <p className="text-sm text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}