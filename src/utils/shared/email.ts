import axios from 'axios'
import emailVerificationTemplate from '@/views/emailTemplates/verifyEmailTemplate'
import resetPasswordTemplate from '@/views/emailTemplates/resetPasswordTemplate'

interface sendEmailProps {
    subject: string
    recipient: string
    html: string
}
const sendEmail = async (payload: sendEmailProps) => {
    const url = 'https://api.brevo.com/v3/smtp/email'
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
    }

    try {
        const body = {
            sender: { email: process.env.SENDER_EMAIL },
            to: [{ email: payload.recipient }],
            subject: payload.subject,
            htmlContent: payload.html,
        }

        const response = await axios.post(url, body, { headers })
        return response.data
    } catch (error) {
        console.error('sendEmail error:', error)
        throw error
    }
}

export const sendEmailVerificationLink = async ({
    recipient,
    token,
    firstName,
}: {
    recipient: string
    token: string
    firstName: string
}) => {
    const html = emailVerificationTemplate({
        firstName,
        verificationLink: `http://localhost:3000/api/verify-email?token=${token}`,
    })

    await sendEmail({ recipient, html, subject: 'Explore: Verify your email' })
}

export const sendPasswordResetLink = async ({
    recipient,
    token,
    firstName,
}: {
    recipient: string
    token: string
    firstName: string
}) => {
    const html = resetPasswordTemplate({
        firstName,
        resetLink: `http://localhost:3000/api/verify-email?token=${token}`,
    })

    await sendEmail({ recipient, html, subject: 'Explore: Reset password' })
}
