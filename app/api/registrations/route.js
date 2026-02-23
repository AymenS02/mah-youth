import { connectDB } from '../../../lib/config/db';
import Registration from "../../../lib/models/RegistrationModel";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    const query = eventId ? { event: eventId } : {};

    // Get all registrations and populate event details
    const registrations = await Registration.find(query)
      .populate({
        path: 'event',
        select: 'title date location category startTime endTime'
      })
      .sort({ registeredAt: -1 })
      .lean();
    
    console.log("✅ Found registrations:", registrations.length);
    
    // Filter out registrations where event was deleted
    const validRegistrations = registrations.filter(reg => reg.event !== null);
    
    console.log("✅ Valid registrations (with event):", validRegistrations.length);

    return Response.json(
      {
        success: true,
        registrations: validRegistrations,
        count: validRegistrations.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error fetching registrations:", error);
    return Response.json(
      { 
        error: "Failed to fetch registrations", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}