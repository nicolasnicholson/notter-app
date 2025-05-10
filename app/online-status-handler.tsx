'use client';

import { useEffect } from 'react';
import { useNotesStore } from '@/store/notes';

export function OnlineStatusHandler() {
  const setOnlineStatus = useNotesStore(state => state.setOnlineStatus);
  const syncWithSupabase = useNotesStore(state => state.syncWithSupabase);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      syncWithSupabase();
    };

    const handleOffline = () => {
      setOnlineStatus(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus, syncWithSupabase]);

  return null;
}