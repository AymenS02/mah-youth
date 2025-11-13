import { connectDB } from '../../../../../lib/config/db';
import Event from '../../../../../lib/models/EventModel';
import Registration from "../../../../../lib/models/RegistrationModel";

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    const {
      fullName,
      email,
      phone,
      dietaryRestrictions,
      emergencyContact,
      emergencyPhone,
      additionalNotes
    } = body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return Response.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return Response.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if event is full
    if (event.registeredAttendees >= event.capacity) {
      return Response.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      event: id,
      fullName: fullName.toLowerCase()
    });

    if (existingRegistration) {
      return Response.json(
        { error: "You have already registered for this event" },
        { status: 400 }
      );
    }

    // Create new registration
    const registration = await Registration.create({
      event: id,
      fullName,
      email: email.toLowerCase(),
      phone,
      dietaryRestrictions,
      emergencyContact,
      emergencyPhone,
      additionalNotes,
      status: 'confirmed'
    });

    // Update event's registered attendees count
    event.registeredAttendees += 1;
    await event.save();

    // TODO: Send confirmation email here
    // await sendConfirmationEmail(email, event, registration);

    return Response.json(
      {
        success: true,
        message: "Registration successful",
        registration: {
          id: registration._id,
          eventTitle: event.title,
          eventDate: event.date,
          confirmationNumber: registration._id.toString().slice(-8).toUpperCase()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { error: "Failed to process registration" },
      { status: 500 }
    );
  }
}