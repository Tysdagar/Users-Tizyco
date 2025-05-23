import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { Email } from '../../authentication/value-objects/email.vo';
import { Phone } from '../../information/value-objects/phone.vo';
import {
  SupportedMFAMethods,
  MFAMethods,
} from '../configuration/method.configuration';
import { AuthenticationChannelData } from '../../../types/user';

export class AuthenticationChannel extends ValueObject<AuthenticationChannelData> {
  constructor(method: string, contact: string) {
    super({ method, contact });
  }

  public validate(value: AuthenticationChannelData): boolean {
    if (!this.checkSupportedMethod(value.method)) {
      return false;
    }

    if (!this.checkSMSContact(value.method, value.contact)) {
      return false;
    }

    if (!this.checkEmailContact(value.method, value.contact)) {
      return false;
    }

    return true;
  }

  private checkSupportedMethod(method: string): boolean {
    if (!method) {
      this.addError(
        'Metodo',
        'Se requiere especificar el metodo del multifactor.',
      );
      return false;
    }

    if (!SupportedMFAMethods.isSupportedMFAMethod(method)) {
      this.addError('Metodo', `Metodo desconocido: ${method}`);
      return false;
    }

    return true;
  }

  private checkSMSContact(method: string, contact: string): boolean {
    if (method.toLowerCase() === (MFAMethods.SMS as string)) {
      return this.validateContact(contact, Phone, 'SMS');
    }

    return true;
  }

  private checkEmailContact(method: string, contact: string): boolean {
    if (method.toLowerCase() === (MFAMethods.EMAIL as string)) {
      return this.validateContact(contact, Email, 'EMAIL');
    }

    return true;
  }

  private validateContact<T extends ValueObject<string>>(
    contact: string,
    Validator: new (value: string) => T,
    type: keyof typeof MFAMethods,
  ): boolean {
    try {
      new Validator(contact);
      return true;
    } catch {
      this.addError(
        'Contacto',
        `El contacto indicado es incorrecto para el metodo ${type}.`,
      );
      return false;
    }
  }
}
