// app/api/events/mock/route.js
import { NextResponse } from 'next/server';

// Mock event data for testing
const mockEvents = [
  {
    _id: '1',
    title: 'Youth Leadership Workshop',
    description: 'Join us for an interactive workshop focused on developing leadership skills and community engagement. Learn from experienced mentors and connect with peers.',
    location: 'MAH Community Center',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    startTime: '6:00 PM',
    endTime: '8:30 PM',
    category: 'Education',
    capacity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800&h=600&fit=crop',
    registeredAttendees: 23,
  },
  {
    _id: '2',
    title: 'Community Sports Day',
    description: 'Annual sports tournament featuring basketball, soccer, and volleyball. Open to all youth members. Bring your A-game and join us for a day of friendly competition!',
    location: 'Hamilton Sports Complex',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    startTime: '10:00 AM',
    endTime: '4:00 PM',
    category: 'Sports',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
    registeredAttendees: 67,
  },
  {
    _id: '3',
    title: 'Islamic Studies Series',
    description: 'Monthly lecture series covering various topics in Islamic history, theology, and contemporary issues. Guest speakers and Q&A sessions included.',
    location: 'MAH Main Hall',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    startTime: '7:00 PM',
    endTime: '9:00 PM',
    category: 'Religious',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    registeredAttendees: 45,
  },
  {
    _id: '4',
    title: 'Volunteer Appreciation Dinner',
    description: 'Celebrating our amazing volunteers with a special dinner and awards ceremony. Your dedication makes our community stronger!',
    location: 'MAH Banquet Hall',
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
    startTime: '6:30 PM',
    endTime: '9:30 PM',
    category: 'Social',
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    registeredAttendees: 89,
  },
];

// GET - Fetch mock events
export async function GET(request) {
  try {
    // Simulate API delay to see loading state
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Return mock events with same format as real API
    return NextResponse.json({
      success: true,
      events: mockEvents.slice(0, limit),
      pagination: {
        page: 1,
        limit,
        total: mockEvents.length,
        pages: 1,
      }
    });
  } catch (error) {
    console.error('❌ Get mock events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
