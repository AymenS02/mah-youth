// app/api/events/[id]/register/route.js

import { connectDB } from '../../../../../lib/config/db';
import Event from '../../../../../lib/models/EventModel';
import Registration from "../../../../../lib/models/RegistrationModel";
import { isRegistrationDeadlinePassed } from '../../../../../lib/utils/eventUtils';

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
      additionalNotes,
      questionAnswers // New field for custom question answers
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
    if (event.capacity > 0 && event.registeredAttendees >= event.capacity) {
      return Response.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }
    
    // Check if registration deadline has passed
    if (isRegistrationDeadlinePassed(event.registrationDeadline)) {
      return Response.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      );
    }

    // Validate required custom questions are answered
    if (event.registrationQuestions && event.registrationQuestions.length > 0) {
      const requiredQuestions = event.registrationQuestions.filter(q => q.required);
      
      for (const question of requiredQuestions) {
        const answer = questionAnswers?.[question.id];
        
        if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
          return Response.json(
            { error: `Please answer the required question: "${question.text}"` },
            { status: 400 }
          );
        }

        // For checkbox type, ensure at least one option is selected
        if (question.type === 'checkbox' && Array.isArray(answer) && answer.length === 0) {
          return Response.json(
            { error: `Please select at least one option for: "${question.text}"` },
            { status: 400 }
          );
        }
      }
    }

    // Check if user already registered (by email)
    const existingRegistration = await Registration.findOne({
      event: id,
      email: email.toLowerCase()
    });

    if (existingRegistration) {
      return Response.json(
        { error: "This email has already been registered for this event" },
        { status: 400 }
      );
    }

    // Process question answers for storage
    let processedAnswers = [];
    if (questionAnswers && event.registrationQuestions) {
      processedAnswers = event.registrationQuestions.map(question => {
        const answer = questionAnswers[question.id];
        return {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          answer: answer || null
        };
      }).filter(qa => qa.answer !== null); // Only store answered questions
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
      questionAnswers: processedAnswers,
      status: 'confirmed'
    });

    // Update event's registered attendees count
    event.registeredAttendees += 1;
    await event.save();

    // TODO: Send confirmation email here
    // await sendConfirmationEmail(email, event, registration);

    console.log('✅ Registration successful:', registration._id);
    console.log('📝 Answered questions:', processedAnswers.length);

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
    console.error("❌ Registration error:", error);
    return Response.json(
      { error: "Failed to process registration" },
      { status: 500 }
    );
  }
}