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
        className="w-full border-2 border-dashed border-[#6366f1] rounded-xl p-6 text-[#a0aec0] hover:border-[#8b5cf6] hover:text-[#e0e7ff] transition text-center font-medium"
      >
        + Add New Bucket List Item
      </button>
    );
  }

  return (
    <div className="bg-[#1e2335] border border-[#2d3748] rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-[#e0e7ff] mb-4">
        ➕ New Bucket List Item
      </h3>

      {error && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-[#a0aec0] mb-2">
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
          <label className="block text-sm font-medium text-[#a0aec0] mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
            placeholder="e.g. Visit Japan"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#a0aec0] mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
            placeholder="Describe your goal..."
            rows={3}
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#a0aec0] mb-2">
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
              className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
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

          <div>
            <label className="block text-sm font-medium text-[#a0aec0] mb-2">
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
              className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
            >
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-sm font-medium text-[#a0aec0] mb-2">
            Target Date
          </label>
          <input
            type="date"
            value={formData.targetDate}
            onChange={(e) =>
              setFormData({ ...formData, targetDate: e.target.value })
            }
            className="w-full bg-[#0f1419] border border-[#2d3748] rounded-lg px-4 py-2.5 text-[#e0e7ff] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#6366f1]/30 transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-[#0f1419] border border-[#2d3748] text-[#a0aec0] py-2.5 rounded-lg font-semibold hover:bg-[#2d3748] transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}