'use client';

import { useState } from 'react';
import { client } from '@/src/lib/dataClient';
import ImageUpload from '@/src/components/ImageUpload';

interface AddItemFormProps {
  onItemAdded: () => void;
}

type Category = 'TRAVEL' | 'ADVENTURE' | 'LEARNING' | 'FOOD' | 'FITNESS' | 'CREATIVE' | 'OTHER';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

interface FormData {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  targetDate: string;
  imageKey: string;
}

export default function AddItemForm({ onItemAdded }: AddItemFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM',
    targetDate: '',
    imageKey: '',
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await client.models.BucketItem.create({
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        priority: formData.priority,
        targetDate: formData.targetDate || null,
        imageKey: formData.imageKey || null,
        isCompleted: false,
      });

      setFormData({
        title: '',
        description: '',
        category: 'OTHER',
        priority: 'MEDIUM',
        targetDate: '',
        imageKey: '',
      });
      setIsOpen(false);
      onItemAdded();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create item');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-6 text-blue-400 hover:border-blue-500 hover:text-blue-600 transition text-center"
      >
        + Add New Bucket List Item
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ➕ New Bucket List Item
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image (optional)
          </label>
          <ImageUpload
            existingImageKey={formData.imageKey || null}
            onImageUploaded={(key) =>
              setFormData({ ...formData, imageKey: key })
            }
            onImageRemoved={() =>
              setFormData({ ...formData, imageKey: '' })
            }
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g. Visit Japan"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Describe your goal..."
            rows={3}
          />
        </div>

        {/* Category & Priority */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Category,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="TRAVEL">✈️ Travel</option>
              <option value="ADVENTURE">🏔️ Adventure</option>
              <option value="LEARNING">📚 Learning</option>
              <option value="FOOD">🍜 Food</option>
              <option value="FITNESS">💪 Fitness</option>
              <option value="CREATIVE">🎨 Creative</option>
              <option value="OTHER">⭐ Other</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as Priority,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Date
          </label>
          <input
            type="date"
            value={formData.targetDate}
            onChange={(e) =>
              setFormData({ ...formData, targetDate: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}