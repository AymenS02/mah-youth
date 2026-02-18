import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/config/db';
import Event from '../../../../lib/models/EventModel';
import Registration from '../../../../lib/models/RegistrationModel';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Fetch the event
    const event = await Event.findById(eventId).lean();
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Fetch all registrations for this event
    const registrations = await Registration.find({ event: eventId }).lean();

    // Calculate metrics
    const totalRegistrations = registrations.length;
    const confirmedRegistrations = registrations.filter(r => r.status === 'confirmed').length;
    const waitlistRegistrations = registrations.filter(r => r.status === 'waitlist').length;
    const cancelledRegistrations = registrations.filter(r => r.status === 'cancelled').length;
    
    // Turnout rate (confirmed / capacity)
    const turnoutRate = event.capacity > 0 
      ? parseFloat(((confirmedRegistrations / event.capacity) * 100).toFixed(2))
      : 0;

    // Gender distribution
    const genderDistribution = registrations.reduce((acc, reg) => {
      const g = reg.gender || 'Not specified';
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    // Age distribution
    const ageRanges = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55-64': 0,
      '65+': 0,
      'Not specified': 0
    };
    
    registrations.forEach(reg => {
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
      } else if (age >= 55 && age <= 64) {
        ageRanges['55-64']++;
      } else {
        ageRanges['65+']++;
      }
    });

    // Status distribution
    const statusDistribution = {
      confirmed: confirmedRegistrations,
      waitlist: waitlistRegistrations,
      cancelled: cancelledRegistrations
    };

    // Registration timeline (grouped by day)
    const registrationsByDay = {};
    registrations.forEach(reg => {
      const dayKey = new Date(reg.registeredAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      registrationsByDay[dayKey] = (registrationsByDay[dayKey] || 0) + 1;
    });

    const registrationTimeline = Object.entries(registrationsByDay)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, count]) => ({ date, count }));

    // Calculate average age
    const ages = registrations.filter(r => r.age).map(r => r.age);
    const averageAge = ages.length > 0 
      ? parseFloat((ages.reduce((sum, age) => sum + age, 0) / ages.length).toFixed(1))
      : 0;

    // Dietary restrictions summary
    const dietaryRestrictions = registrations
      .filter(r => r.dietaryRestrictions && r.dietaryRestrictions.trim() !== '')
      .map(r => r.dietaryRestrictions);
    const uniqueDietaryRestrictions = [...new Set(dietaryRestrictions)];

    return NextResponse.json({
      success: true,
      eventAnalytics: {
        event: {
          id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          location: event.location,
          category: event.category,
          capacity: event.capacity,
          imageUrl: event.imageUrl
        },
        summary: {
          totalRegistrations,
          confirmedRegistrations,
          waitlistRegistrations,
          cancelledRegistrations,
          turnoutRate,
          spotsRemaining: Math.max(0, event.capacity - confirmedRegistrations),
          averageAge
        },
        distributions: {
          gender: genderDistribution,
          age: ageRanges,
          status: statusDistribution
        },
        timeline: registrationTimeline,
        insights: {
          dietaryRestrictionsCount: dietaryRestrictions.length,
          uniqueDietaryRestrictions
        }
      }
    });

  } catch (error) {
    console.error('❌ Event analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event analytics', details: error.message },
      { status: 500 }
    );
  }
}
