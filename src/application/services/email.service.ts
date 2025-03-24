import { IEmailService } from 'src/domain/common/interfaces/email-service.interface';

/**
 * Abstract base class for email services.
 *
 * This class defines the contract for email operations, including a method for sending
 * generic emails and a concrete implementation for sending verification emails.
 * It implements the `IEmailService` interface and is meant to be extended by specific
 * implementations that handle the email delivery logic.
 */
export abstract class EmailService implements IEmailService {
  /**
   * Sends an email using the provided parameters.
   *
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param template - The template used for the email body.
   * @param context - Optional context data for the email template.
   * @returns A promise that resolves when the email has been sent.
   */
  abstract sendEmail(
    to: string,
    subject: string,
    template: string,
    context?: any,
  ): Promise<void>;

  /**
   * Sends a verification email to the specified recipient.
   *
   * This method uses a predefined email template and subject to
   * send a verification email.
   *
   * @param to - The recipient's email address.
   * @returns A promise that resolves when the verification email has been sent.
   */
  public async sendVerifyEmail(to: string): Promise<void> {
    const template = 'email-verify.template';
    const subject = 'Verify ur email';
    await this.sendEmail(to, subject, template);
  }
}
