import { connectDB } from '../../../../lib/config/db';
import Registration from "../../../../lib/models/RegistrationModel";

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    const registration = await Registration.findById(id)
      .populate('event');

    if (!registration) {
      return Response.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        registration
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching registration:", error);
    return Response.json(
      { error: "Failed to fetch registration" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return Response.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Update event's registered attendees count
    const Event = (await import("../../../../lib/models/EventModel.js")).default;
    await Event.findByIdAndUpdate(
      registration.event,
      { $inc: { registeredAttendees: -1 } }
    );

    return Response.json(
      {
        success: true,
        message: "Registration deleted successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting registration:", error);
    return Response.json(
      { error: "Failed to delete registration" },
      { status: 500 }
    );
  }
}