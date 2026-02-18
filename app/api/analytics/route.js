import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/config/db';
import Event from '../../../lib/models/EventModel';
import Registration from '../../../lib/models/RegistrationModel';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const gender = searchParams.get('gender') || '';
    const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')) : null;
    const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')) : null;
    const startDate = searchParams.get('startDate') || null;
    const endDate = searchParams.get('endDate') || null;
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';

    // Build registration filter
    let registrationFilter = {};
    if (gender && gender !== 'all') {
      registrationFilter.gender = gender;
    }
    if (minAge !== null || maxAge !== null) {
      registrationFilter.age = {};
      if (minAge !== null) registrationFilter.age.$gte = minAge;
      if (maxAge !== null) registrationFilter.age.$lte = maxAge;
    }
    if (status && status !== 'all') {
      registrationFilter.status = status;
    }

    // Build event filter for date range and category
    let eventFilter = {};
    if (startDate || endDate) {
      eventFilter.date = {};
      if (startDate) eventFilter.date.$gte = new Date(startDate);
      if (endDate) eventFilter.date.$lte = new Date(endDate);
    }
    if (category && category !== 'all') {
      eventFilter.category = category;
    }

    // Fetch all registrations with filters
    const registrations = await Registration.find(registrationFilter)
      .populate({
        path: 'event',
        match: eventFilter,
        select: 'title date location category capacity registeredAttendees startTime endTime'
      })
      .lean();

    // Filter out registrations where event doesn't match or was deleted
    const validRegistrations = registrations.filter(reg => reg.event !== null);

    // Fetch all events with filters
    const events = await Event.find(eventFilter).lean();

    // Calculate key metrics
    const totalEvents = events.length;
    const totalRegistrations = validRegistrations.length;
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
    const pastEvents = events.filter(e => new Date(e.date) < new Date()).length;
    
    // Calculate average attendance (registrations per event)
    const averageAttendance = totalEvents > 0 
      ? (totalRegistrations / totalEvents).toFixed(2) 
      : 0;

    // Calculate capacity utilization
    const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
    const capacityUtilization = totalCapacity > 0 
      ? ((totalRegistrations / totalCapacity) * 100).toFixed(2) 
      : 0;

    // Gender distribution
    const genderDistribution = validRegistrations.reduce((acc, reg) => {
      const g = reg.gender || 'Not specified';
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    // Age distribution (group by ranges)
    const ageRanges = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55+': 0,
      'Not specified': 0
    };
    
    validRegistrations.forEach(reg => {
      const age = reg.age;
      if (!age) {
        ageRanges['Not specified']++;
      } else if (age < 18) {
        ageRanges['Under 18']++;
      } else if (age >= 18 && age <= 24) {
        ageRanges['18-24']++;
      } else if (age >= 25 && age <= 34) {
        ageRanges['25-34']++;
      } else if (age >= 35 && age <= 44) {
        ageRanges['35-44']++;
      } else if (age >= 45 && age <= 54) {
        ageRanges['45-54']++;
      } else {
        ageRanges['55+']++;
      }
    });

    // Category distribution
    const categoryDistribution = events.reduce((acc, event) => {
      const cat = event.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Registration trends by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const registrationsByMonth = {};
    validRegistrations.forEach(reg => {
      const regDate = new Date(reg.registeredAt);
      if (regDate >= sixMonthsAgo) {
        const monthKey = regDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        registrationsByMonth[monthKey] = (registrationsByMonth[monthKey] || 0) + 1;
      }
    });

    // Sort by date and convert to array for charting
    const sortedMonths = Object.entries(registrationsByMonth)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([month, count]) => ({ month, count }));

    // Top performing events (by registration count)
    const eventRegistrationCounts = {};
    validRegistrations.forEach(reg => {
      if (reg.event && reg.event._id) {
        const eventId = reg.event._id.toString();
        if (!eventRegistrationCounts[eventId]) {
          eventRegistrationCounts[eventId] = {
            event: reg.event,
            count: 0
          };
        }
        eventRegistrationCounts[eventId].count++;
      }
    });

    const topEvents = Object.values(eventRegistrationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(item => ({
        title: item.event.title,
        date: item.event.date,
        registrations: item.count,
        capacity: item.event.capacity || 0,
        category: item.event.category,
        utilizationPercentage: item.event.capacity > 0 
          ? ((item.count / item.event.capacity) * 100).toFixed(2)
          : 0
      }));

    // Event performance data (for chart showing capacity vs registrations)
    const eventPerformance = events
      .map(event => {
        const eventId = event._id.toString();
        const regCount = eventRegistrationCounts[eventId]?.count || event.registeredAttendees || 0;
        return {
          title: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
          fullTitle: event.title,
          registrations: regCount,
          capacity: event.capacity || 0,
          date: event.date
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Status distribution
    const statusDistribution = validRegistrations.reduce((acc, reg) => {
      const s = reg.status || 'confirmed';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      analytics: {
        summary: {
          totalEvents,
          totalRegistrations,
          upcomingEvents,
          pastEvents,
          averageAttendance,
          capacityUtilization,
          totalCapacity
        },
        distributions: {
          gender: genderDistribution,
          age: ageRanges,
          category: categoryDistribution,
          status: statusDistribution
        },
        trends: {
          registrationsByMonth: sortedMonths
        },
        topEvents,
        eventPerformance
      }
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
}
