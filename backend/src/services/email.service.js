import { transporter } from '../config/email.js';
import { 
  verificationEmailTemplate, 
  passwordResetTemplate,
  welcomeEmailTemplate,
  providerApprovalTemplate,
  providerRejectionTemplate,
} from '../templates/email/index.js';

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (email, token, name) => {
  const url = `${process.env.CLIENT_WEB_URL}/verify-email/${token}`;
  const html = verificationEmailTemplate(url, name);
  await sendEmail(email, 'Verify Your Email - Karigar', html);
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const url = `${process.env.CLIENT_WEB_URL}/reset-password/${token}`;
  const html = passwordResetTemplate(url, name);
  await sendEmail(email, 'Reset Your Password - Karigar', html);
};

export const sendWelcomeEmail = async (email, name) => {
  const html = welcomeEmailTemplate(name);
  await sendEmail(email, 'Welcome to Karigar!', html);
};

export const sendProviderApprovalEmail = async (email, name) => {
  const profileUrl = `${process.env.CLIENT_WEB_URL}/provider/complete-profile`;
  const html = providerApprovalTemplate(name, profileUrl);
  await sendEmail(email, 'Provider Application Approved - Karigar', html);
};

export const sendProviderRejectionEmail = async (email, name, reason) => {
  const reapplyUrl = `${process.env.CLIENT_WEB_URL}/dashboard`;
  const html = providerRejectionTemplate(name, reason, reapplyUrl);
  await sendEmail(email, 'Provider Application Update - Karigar', html);
};
