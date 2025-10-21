import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { to, message } = await request.json();

    // You'll need to install twilio: npm install twilio
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // For now, we'll just log the SMS (you can implement Twilio later)
    console.log('SMS Alert:', {
      to: to,
      message: message,
      timestamp: new Date().toISOString()
    });

    // Uncomment this when you set up Twilio:
    // const result = await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: to
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'SMS alert sent successfully',
      // messageId: result.sid // Uncomment when using Twilio
    });

  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS alert' },
      { status: 500 }
    );
  }
}
