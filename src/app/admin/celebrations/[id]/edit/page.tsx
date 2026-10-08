'use client';

import React, { use, useEffect, useState } from 'react';
import CelebrationForm from '@/components/admin/CelebrationForm';
import { api } from '@/lib/api';
import { useBreadcrumbs } from '@/lib/breadcrumbContext';
import { fallbackCelebrations } from '@/lib/cmsClient';

interface EditCelebrationPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCelebrationPage({ params }: EditCelebrationPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { setEntityTitle } = useBreadcrumbs?.() || { setEntityTitle: () => {} };

  const [celebration, setCelebration] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCelebration() {
      try {
        const res = await api.get(`/celebrations/${id}`);
        if (res.success && res.data) {
          setCelebration(res.data);
          if (res.data.title && setEntityTitle) {
            setEntityTitle(id, res.data.title);
          }
        } else {
          // Check fallback match
          const fallbackMatch = fallbackCelebrations.find(
            (c) => (c._id === id || c.id === id || encodeURIComponent(c.title) === id)
          );
          if (fallbackMatch) {
            setCelebration(fallbackMatch);
          } else {
            setError('Celebration record not found');
          }
        }
      } catch (err: any) {
        // Check fallback match on API error
        const fallbackMatch = fallbackCelebrations.find(
          (c) => (c._id === id || c.id === id || encodeURIComponent(c.title) === id)
        );
        if (fallbackMatch) {
          setCelebration(fallbackMatch);
        } else {
          setError(err.message || 'Failed to load celebration details');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadCelebration();
  }, [id, setEntityTitle]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-slate-400 animate-pulse">
        Loading celebration details...
      </div>
    );
  }

  if (error || !celebration) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-xs font-bold text-red-700">
        ⚠️ {error || 'Celebration moment not found'}
      </div>
    );
  }

  return <CelebrationForm initialData={celebration} isEdit={true} />;
}
