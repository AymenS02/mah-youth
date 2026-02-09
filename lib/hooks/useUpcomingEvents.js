'use client';

import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to fetch top 3 upcoming events using React Query
 * Features:
 * - Fetches only the top 3 events
 * - Sorts by date ascending (soonest first)
 * - Caches data with 5 minute staleTime
 * - Background refetch on stale data
 */
export function useUpcomingEvents() {
  return useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: async () => {
      // Always use real API endpoint
      const endpoint = '/api/events?limit=100';
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      
      if (!data.success || !data.events) {
        throw new Error('Invalid response format');
      }
      
      // Filter upcoming events (date >= today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingEvents = data.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today;
      });
      
      // Sort by date ascending (soonest first) and take top 3
      const sortedEvents = upcomingEvents
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      
      return sortedEvents;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}
