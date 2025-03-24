import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { promises as fs } from 'fs';
import * as handlebars from 'handlebars';
import { EmailService } from 'src/application/services/email.service';

/**
 * Service responsible for sending emails using Nodemailer.
 */
@Injectable()
export class EmailClient extends EmailService {
  private transporter: nodemailer.Transporter;
  private templatesPath: string = 'src/infraestructure/configuration/templates';

  /**
   * Initializes the email client with the necessary configurations.
   * @param {ConfigService} configService - Service for accessing configuration variables.
   */
  constructor(private readonly configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  /**
   * Loads and compiles an email template using Handlebars.
   * @param {string} templateName - Name of the template file (without extension).
   * @param {any} context - Data to populate the template.
   * @returns {Promise<string>} Compiled HTML content of the template.
   */
  private async loadTemplate(
    templateName: string,
    context: any,
  ): Promise<string> {
    const filePath = path.resolve(
      process.cwd(),
      this.templatesPath,
      `${templateName}.hbs`,
    );
    const templateContent = await fs.readFile(filePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateContent);
    return compiledTemplate(context);
  }

  /**
   * Sends an email with the specified parameters.
   * @param {string} to - Recipient's email address.
   * @param {string} subject - Subject of the email.
   * @param {string} template - Template name to use for the email content.
   * @param {any} [context] - Data to populate the email template.
   * @returns {Promise<void>} Resolves when the email is sent successfully.
   */
  public async sendEmail(
    to: string,
    subject: string,
    template: string,
    context?: any,
  ): Promise<void> {
    const htmlContent = await this.loadTemplate(template, context);

    await this.transporter.sendMail({
      from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM')}>`,
      to,
      subject,
      html: htmlContent,
    });
  }
}
