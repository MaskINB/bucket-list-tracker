"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { client } from "@/src/lib/dataClient";
import { getUrl } from "aws-amplify/storage";

interface BucketItemProps {
  item: {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    isCompleted?: boolean | null;
    priority?: string | null;
    targetDate?: string | null;
    imageKey?: string | null;
  };
  onUpdate: () => void;
}

const categoryEmoji: Record<string, string> = {
  TRAVEL: "✈️",
  ADVENTURE: "🏔️",
  LEARNING: "📚",
  FOOD: "🍜",
  FITNESS: "💪",
  CREATIVE: "🎨",
  OTHER: "⭐",
};

const priorityColor: Record<string, string> = {
  LOW: "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
  MEDIUM: "bg-amber-900/30 text-amber-400 border border-amber-800",
  HIGH: "bg-red-900/30 text-red-400 border border-red-800",
};

export default function BucketItem({ item, onUpdate }: BucketItemProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load image from S3 if imageKey exists
  useEffect(() => {
    const loadImage = async () => {
      if (item.imageKey) {
        try {
          const result = await getUrl({
            path: item.imageKey,
            options: { validateObjectExistence: false },
          });
          setImageUrl(result.url.toString());
        } catch {
          console.error("Failed to load image");
        }
      }
    };
    loadImage();
  }, [item.imageKey]);

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
    if (!confirm("Delete this item?")) return;
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
      className={`bg-[#1e2335] border border-[#2d3748] rounded-xl shadow-lg overflow-hidden transition ${
        item.isCompleted ? "opacity-50" : ""
      }`}
    >
      {/* Item image if exists */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized
          />
          {item.isCompleted && (
            <div className="absolute inset-0 bg-emerald-500 bg-opacity-30 flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Complete toggle */}
            <button
              onClick={toggleComplete}
              disabled={loading}
              className={`mt-1 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition ${
                item.isCompleted
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-[#2d3748] hover:border-[#6366f1]"
              }`}
            >
              {item.isCompleted && "✓"}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg">
                  {categoryEmoji[item.category ?? "OTHER"]}
                </span>
                <h3
                  className={`font-semibold text-[#e0e7ff] ${
                    item.isCompleted ? "line-through text-[#6b7280]" : ""
                  }`}
                >
                  {item.title}
                </h3>
                {item.priority && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      priorityColor[item.priority]
                    }`}
                  >
                    {item.priority}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-sm text-[#a0aec0] mt-1">{item.description}</p>
              )}

              {item.targetDate && (
                <p className="text-xs text-[#6b7280] mt-2">
                  🗓️ Target: {item.targetDate}
                </p>
              )}
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-[#6b7280] hover:text-red-400 transition text-2xl shrink-0"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
