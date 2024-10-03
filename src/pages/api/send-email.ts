export const prerender = false;

import nodemailer from 'nodemailer';

import type { APIRoute } from 'astro';


export const POST: APIRoute = async ({ request }) => {
    const data = await request.json();
    // Nodemailer SMTP transport configuration
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: import.meta.env.GMAIL_USER ?? process.env.GMAIL_USER, // Your Gmail account
        pass: import.meta.env.GMAIL_APP_PASSWORD ?? process.env.GMAIL_APP_PASSWORD, // Gmail App password (use app password, not your Gmail password)
        },
    });

    // Define email options
    let mailOptions = {
        from: import.meta.env.GMAIL_USER ?? process.env.GMAIL_USER,
        to: import.meta.env.GMAIL_SELF_EMAIL ?? process.env.GMAIL_SELF_EMAIL, // Destination email
        subject: `New Contact Form Submission from ${data.name} <${data.email}>`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        return new Response(
            JSON.stringify({ message: 'Email sent successfully!' }),
            {status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to send email' }),
            {status: 500 }
        );
    }
}