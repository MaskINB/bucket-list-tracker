'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import type { AuthUser } from 'aws-amplify/auth';
import { configureAmplify } from '@/src/lib/amplify';
import { client } from '@/src/lib/dataClient';
import Navbar from '@/src/components/Navbar';
import AddItemForm from '@/src/components/AddItemForm';
import BucketItem from '@/src/components/BucketItem';

configureAmplify();

type BucketItemType = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  isCompleted?: boolean | null;
  priority?: string | null;
  targetDate?: string | null;
};

type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [items, setItems] = useState<BucketItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      const { data } = await client.models.BucketItem.list();
      setItems(data as BucketItemType[]);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  }, []);

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await fetchItems();
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router, fetchItems]);

  const filteredItems = items.filter((item) => {
    if (filter === 'ACTIVE') return !item.isCompleted;
    if (filter === 'COMPLETED') return item.isCompleted;
    return true;
  });

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#a0aec0]">Loading your bucket list...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419]">
      <Navbar user={user ?? undefined} />

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Progress bar */}
        <div className="bg-[#1e2335] border border-[#2d3748] rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-[#e0e7ff]">Your Progress</h2>
            <span className="text-sm text-[#a0aec0]">
              {completedCount} / {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-[#0f1419] rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all"
              style={{
                width: totalCount > 0
                  ? `${(completedCount / totalCount) * 100}%`
                  : '0%',
              }}
            />
          </div>
        </div>

        {/* Add item form */}
        <AddItemForm onItemAdded={fetchItems} />

        {/* Filter tabs */}
        <div className="flex gap-2 my-6">
          {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/30'
                  : 'bg-[#1e2335] border border-[#2d3748] text-[#a0aec0] hover:bg-[#2d3748]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-[#a0aec0]">
              <p className="text-4xl mb-3">🪣</p>
              <p className="font-medium text-[#e0e7ff]">No items yet!</p>
              <p className="text-sm">Add your first bucket list item above.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <BucketItem
                key={item.id}
                item={item}
                onUpdate={fetchItems}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}