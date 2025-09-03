'use server';
import UNMUPendingRegistrationEmail from '@/emails/WelcomeBeforeApproval';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export type MailDataProps = {
  name: string;
  trackingNumber: string;
  email: string;
  phone: string;
};

interface InviteProps {
  link: string;
  role: string;
  email: string;
}

export async function sendWelcomeMail(mailData: MailDataProps) {
  try {
    const { error, data } = await resend.emails.send({
      from: 'Acme <onboarding@desishub.com>',
      to: 'gmukejohnbaptist@gmail.com',
      subject: 'Registration Pending',
      react: UNMUPendingRegistrationEmail(mailData),
    });
    if (error) {
      console.log(error);
    }
    console.log('email data', data);
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
}
