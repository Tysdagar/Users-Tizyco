/**
 * Interface for an Email Service, responsible for sending emails using predefined templates.
 */
export interface IEmailService {
  /**
   * Sends an email to a specified recipient using a provided template and context.
   *
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param template - The template identifier for the email body.
   * @param context - Optional context data to populate the template.
   * @returns A promise that resolves when the email is successfully sent.
   *
   * @example
   * ```typescript
   * await emailService.sendEmail(
   *   'recipient@example.com',
   *   'Welcome to Our Service',
   *   'welcome-template',
   *   { username: 'JohnDoe' },
   * );
   * ```
   */
  sendEmail(
    to: string,
    subject: string,
    template: string,
    context?: any,
  ): Promise<void>;
}
