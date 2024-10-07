// import { google } from 'googleapis';
// import { NextApiRequest, NextApiResponse } from 'next';

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
// //   if (req.method !== 'POST') {
// //     return res.status(405).json({ message: 'Only POST requests allowed' });
// //   }

//   console.log(req.body, "google client api");

//   try {
//     const { todo, accessToken } = req.body;
//     console.log(todo, "todo");

//     const auth = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.GOOGLE_REDIRECT_URL
//     );

//     // Set credentials using the access token
//     auth.setCredentials({
//       access_token: accessToken,
//     });

//     const calendar = google.calendar({ version: 'v3', auth });

//     const event = {
//       summary: todo.title,
//       description: todo.description,
//       start: {
//         dateTime: todo.dueDate,
//         timeZone: 'Asia/Kolkata', // Set your timezone here
//       },
//       end: {
//         dateTime: todo.dueDate,
//         timeZone: 'Asia/Kolkata',
//       },
//       reminders: {
//         useDefault: false,
//         overrides: [
//           { method: 'email', minutes: 24 * 60 }, // Email reminder 1 day before
//           { method: 'popup', minutes: 10 }, // Popup reminder 10 minutes before
//         ],
//       },
//     };

//     const response = await calendar.events.insert({
//       calendarId: 'primary', // Use the user's primary calendar
//       requestBody: event,
//     });
//     return response.status === 200 ? res.json({ eventLink: response.data.htmlLink }) : res.status(500).json({ error: 'Failed to add event to Google Calendar' });
//     // res.status(200).json({ eventLink: response.data.htmlLink });
//   } catch (error) {
//     console.error('Error adding event to Google Calendar:', error);
//     return res.status(500).json({ error: 'Failed to add event to Google Calendar' });
//     // res.status(500).json({ error: 'Failed to add event to Google Calendar' });
//   }
// }


import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
// import { useSession } from 'next-auth/react';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log("in req method");
    return new Response("Message", { status: 405 });
  }
//   const {data :Session} = useSession();

  try {
    const body = await req.json(); // Parse the request body
    const { todo, accessToken } = body; // Destructure todo and accessToken
    console.log(body, "todo");
    
    // Initialize OAuth2 client
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    // Set OAuth2 credentials with the access token
    auth.setCredentials({
      access_token: accessToken,
    });

    // Create a Google Calendar instance with authenticated client
    const calendar = google.calendar({ version: 'v3', auth });

    // Define the event based on the Todo data
    const event = {
      summary: "testing",
      description: "tetingn",
      start: {
        dateTime:'2024-10-05T00:00:00.000Z' ,  // Make sure todo.dueDate is an ISO format datetime string
        timeZone: 'Asia/Kolkata', // Set your timezone
      },
      end: {
        dateTime: '2024-10-05T00:00:00.000Z',  // End at the same time if it's a single instance event
        timeZone: 'Asia/Kolkata',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // Email reminder 1 day before
          { method: 'popup', minutes: 10 },      // Popup reminder 10 minutes before
        ],
      },
    };

    // Insert the event into the user's primary calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    // Check if the event was added successfully
    if (response.status === 200) {
        console.log(response.data , "sucess");
        return new Response("Message" , { status: 200 });
    } else {
        console.log(response.data , "failed");
        return new Response("Message", { status: 500 });
    }
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    return new Response("Message", { status: 500 });
    
  }
}
