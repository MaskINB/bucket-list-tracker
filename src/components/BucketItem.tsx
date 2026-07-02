'use client';

import { useState } from 'react';
import { client } from '@/src/lib/dataClient';

interface BucketItemProps {
  item: {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    isCompleted?: boolean | null;
    priority?: string | null;
    targetDate?: string | null;
  };
  onUpdate: () => void;
}

const categoryEmoji: Record<string, string> = {
  TRAVEL: '✈️',
  ADVENTURE: '🏔️',
  LEARNING: '📚',
  FOOD: '🍜',
  FITNESS: '💪',
  CREATIVE: '🎨',
  OTHER: '⭐',
};

const priorityColor: Record<string, string> = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};

export default function BucketItem({ item, onUpdate }: BucketItemProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const toggleComplete = async (): Promise<void> => {
    setLoading(true);
    try {
      await client.models.BucketItem.update({
        id: item.id,
        isCompleted: !item.isCompleted,
      });
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm('Delete this item?')) return;
    setLoading(true);
    try {
      await client.models.BucketItem.delete({ id: item.id });
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-5 transition ${
        item.isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Complete toggle button */}
          <button
            onClick={toggleComplete}
            disabled={loading}
            className={`mt-1 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
              item.isCompleted
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
            }`}
          >
            {item.isCompleted && '✓'}
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">
                {categoryEmoji[item.category ?? 'OTHER']}
              </span>
              <h3
                className={`font-semibold text-gray-800 ${
                  item.isCompleted ? 'line-through text-gray-400' : ''
                }`}
              >
                {item.title}
              </h3>
              {item.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    priorityColor[item.priority]
                  }`}
                >
                  {item.priority}
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}

            {item.targetDate && (
              <p className="text-xs text-gray-400 mt-2">
                🗓️ Target: {item.targetDate}
              </p>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-gray-300 hover:text-red-400 transition text-xl shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}   