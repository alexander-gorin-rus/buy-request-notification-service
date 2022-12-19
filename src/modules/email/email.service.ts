import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { IMailOptions } from '../../types';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendNewRequestCreatedMail(options: IMailOptions) {
    const { to, context, locale } = options;
    return this.sendTemplate({
      to,
      context,
      subject: 'Buy-request',
      template: `request.created.${locale.toLowerCase()}.hbs`,
    });
  }

  private async sendTemplate(options: ISendMailOptions) {
    const { to, subject, template, context } = options;
    return this.mailService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }

  async sendNewUserCreatedMail(options: IMailOptions) {
    const { to, context, locale } = options;

    await this.sendTemplate({
      to,
      context,
      subject: 'Buy-request',
      template: `user.created.${locale.toLowerCase()}.hbs`,
    });
  }

  async sendPasswordChange(options: IMailOptions): Promise<void> {
    const { to, context, locale } = options;

    await this.sendTemplate({
      to,
      context,
      subject: 'Buy-request',
      template: `password.change.${locale.toLowerCase()}.hbs`,
    });
  }

  async sendNewCodeMail(options: IMailOptions) {
    const { to, context, locale } = options;

    await this.sendTemplate({
      to,
      context,
      subject: 'Buy-request',
      template: `code.created.${locale.toLowerCase()}.hbs`,
    });
  }
}
