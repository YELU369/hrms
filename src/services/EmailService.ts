import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { emailconfig } from '@/config/email';
import { generalconfig } from '@/config/general';

export class EmailService {

  private static transporter = nodemailer.createTransport(
    process.env.NODE_ENV === 'production'
      ? {
          service: 'gmail',
          auth: {
            user: emailconfig.user,
            pass: emailconfig.password,
          },
          debug: true,
          logger: true,
        }
      : {
          host: emailconfig.host,
          port: emailconfig.port,
          secure: false,
          auth: emailconfig.user
            ? {
                user: emailconfig.user,
                pass: emailconfig.password,
              }
            : undefined,
          debug: true,
          logger: true,
        }
  );

  private static async loadTemplate(name: string): Promise<string> {
    const filePath = path.join(__dirname, '../templates', `${name}.html`);
    return fs.readFile(filePath, 'utf-8');
  }

  private static fillTemplate(template: string, vars: Record<string, string>): string {
    return Object.entries(vars).reduce(
      (html, [key, val]) => html.replace(new RegExp(`{{${key}}}`, 'g'), val),
      template
    );
  }

  static async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('SMTP connected');
      return true;
    } catch (err) {
      console.error('SMTP error:', err);
      return false;
    }
  }

  private static async send(
    to: string,
    subject: string,
    templateName: string,
    vars: Record<string, string>
  ): Promise<void> {

    const template = await this.loadTemplate(templateName);
    const html = this.fillTemplate(template, vars);

    const mail = {
      from: `"HR Team" <${emailconfig.user}>`,
      to,
      subject,
      html,
    };

    const info = await this.transporter.sendMail(mail);
    console.log(`${subject} email sent:`, info.messageId);
  }

  static sendVerificationEmail(to: string, name: string, token: string) {
    return this.send(to, 'Verify Your Email', 'verify_email', {
      name,
      verificationLink: `${generalconfig.verify_url}/${token}`,
    });
  }

  static sendPasswordResetEmail(to: string, name: string, token: string) {
    return this.send(to, 'Reset Your Password', 'reset_password', {
      name,
      resetLink: `${generalconfig.reset_url}/${token}`,
    });
  }
}
