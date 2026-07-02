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
        <p className="text-gray-400">Loading your bucket list...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user ?? undefined} />

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* Progress bar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-gray-700">Your Progress</h2>
            <span className="text-sm text-gray-500">
              {completedCount} / {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Items list */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">🪣</p>
              <p className="font-medium">No items yet!</p>
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