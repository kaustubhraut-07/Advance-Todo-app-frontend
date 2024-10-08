
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req : NextRequest) {
   
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    try {
        
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const authClient = await auth.getClient();
        console.log(authClient, "auth client");

       
        const calendar = google.calendar({ version: 'v3', auth: authClient });

       
        const { data: { items: events } } = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        if (events && events.length > 0) {
            console.log('Upcoming events:', events);
        } else {
            console.log('No upcoming events found.');
        }

       
        const event = {
            summary: 'Google I/O 2024',
            location: '800 Howard St., San Francisco, CA 94103',
            description: 'A chance to hear more about Google\'s developer products.',
            start: {
                dateTime: '2024-10-08T05:30:00+05:30',
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: '2024-10-08T06:30:00+05:30',
                timeZone: 'Asia/Kolkata',
            },
            recurrence: [
                'RRULE:FREQ=DAILY;COUNT=2',
            ],
            // Uncomment if Domain-Wide Delegation is set up
            // attendees: [
            //     { email: 'kaustubhraut135@gmail.com' },
            //     { email: 'kaustubh.raut@fxis.ai' },
            // ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 },
                ],
            },
        };

        
        const response = await calendar.events.insert({
           calendarId: 'kaustubhraut135@gmail.com',
            // calendarId: 'primary',
            resource: event,
            sendNotifications: true,
            sendUpdates: 'all',
        });

        console.log(response, "response");

        return NextResponse.json({ message: 'Event created', link: response.data.htmlLink }, { status: 200 });
    } catch (error) {
        console.error('Error accessing Calendar API:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

// import { getSession } from "next-auth/react"; 
// import { NextApiRequest, NextApiResponse   } from 'next';
// import { NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]/options";

// export  async function POST(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         const session = await getServerSession(authOptions);

//         console.log(session, "session in add calendar")
//         if (!session || !session.accessToken) {
//             return NextResponse.json({ message: 'Unauthorized'}, { status: 401 });
//         }

//         const { summary, location, description, start, end } = req.body;

//         const calendarId = 'kaustubhraut135@gmail.com'; 
//         const accessToken = session.accessToken; 

//         const eventData = {
//             start: {
//                 dateTime: start, 
//                 timeZone: 'Asia/Kolkata',
//             },
//             end: {
//                 dateTime: end, 
//                 timeZone: 'Asia/Kolkata',
//             },
//             summary: summary || 'Default Event Title',
//             description: description || 'No description provided.',
//             location: location || 'Default Location',
//         };

//         try {
//             const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?sendNotifications=false`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${accessToken}`,
//                 },
//                 body: JSON.stringify(eventData),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log('Event created:', data);
//                 return NextResponse.json({ message: 'Event created' , data}, { status: 200 });
//             } else {
//                 const errorData = await response.json();
//                 return NextResponse.json({ message: 'Internal server error' , error: errorData}, { status: 500 });
//             }
//         } catch (error) {
//             console.error('Error creating event:', error);
//             return NextResponse.json({ message: 'Internal server error' , error}, { status: 500 });
//         }
//     } else {
//         return NextResponse.json({ message: 'Some error'}, { status: 405 });
//     }
// }
