import { Resend } from 'resend';

const resend = new Resend('re_QposRyJi_F86SR8z8D7QuXrSpgipGhWF5');

async function testEmail() {
  console.log("Attempting to send email to mohitmadhu.j24@iiits.in...");
  try {
    const data = await resend.emails.send({
      from: 'EagerMinds <onboarding@resend.dev>',
      to: 'mohitmadhu.j24@iiits.in',
      subject: 'Test Email from Script',
      html: '<p>Testing Resend API</p>'
    });
    console.log("Success! Data:", data);
  } catch (error) {
    console.error("Resend API Error:", error);
  }
}

testEmail();
