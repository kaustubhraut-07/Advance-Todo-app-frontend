
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
                dateTime: '2024-10-07T17:00:00-07:00',
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: '2024-10-07T17:00:00-08:00',
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
            calendarId: 'primary',
            resource: event,
        });

        console.log(response, "response");

        return NextResponse.json({ message: 'Event created', link: response.data.htmlLink }, { status: 200 });
    } catch (error) {
        console.error('Error accessing Calendar API:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

