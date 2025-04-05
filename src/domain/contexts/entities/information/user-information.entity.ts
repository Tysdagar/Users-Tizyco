import { type UserInformationParams } from '../../types/user';
import { Phone } from './value-objects/phone.vo';
import { FullName } from './value-objects/full-name.vo';
import { Gender } from './value-objects/gender.vo';
import { Location } from './value-objects/location.vo';
import { INFO_EXCEPTION_FACTORY } from './exceptions/information-exception.factory';

/**
 * Represents the personal information entity within the User aggregate.
 *
 * @remarks
 * This entity manages all personal details of a user including name, gender,
 * contact information, and location. It is part of the User aggregate root
 * and follows strict validation rules through composed Value Objects.
 *
 * @remarks
 * This is an entity that belongs to the User aggregate root.
 */
export class UserInformation {
  private _fullName: FullName | null = null;
  private _gender: Gender | null = null;
  private _phone: Phone | null = null;
  private _location: Location | null = null;

  /**
   * Private constructor to enforce factory method usage.
   */
  private constructor() {}

  // Static Factory Methods

  /**
   * Creates an empty UserInformation instance.
   * @returns New empty UserInformation instance.
   */
  public static initialize(): UserInformation {
    return new UserInformation();
  }

  /**
   * Builds a UserInformation instance from existing parameters.
   * @param information - User information parameters.
   * @returns Configured UserInformation instance.
   */
  public static build(information: UserInformationParams): UserInformation {
    const userInfo = this.initialize();
    userInfo.updateFullName(information);
    userInfo.updateGender(information);
    userInfo.updateContact(information);
    userInfo.updateLocation(information);
    return userInfo;
  }

  // Public Interface

  /**
   * Updates user information with provided parameters.
   * @param information - Partial user information parameters.
   * @throws {InformationException} If no valid properties are provided for update.
   */
  public update(information: UserInformationParams): void {
    if (!this.canUpdateInformation(information)) {
      INFO_EXCEPTION_FACTORY.throw('NO_INFORMATION_PROPERTIES_TO_UPDATE');
    }
    this.updateFullName(information);
    this.updateGender(information);
    this.updateContact(information);
    this.updateLocation(information);
  }

  // Validation Methods

  /**
   * Checks if there are any valid properties to update.
   * @param information - User information parameters.
   * @returns True if at least one valid property exists for update.
   */
  private canUpdateInformation(information: UserInformationParams): boolean {
    return Object.values(information).some((value) => value !== undefined);
  }

  // Property Update Methods

  /**
   * Updates the full name if provided in parameters.
   * @param information - User information parameters.
   */
  private updateFullName(information: UserInformationParams): void {
    if (information.firstName || information.lastName) {
      this.setFullName(information.firstName, information.lastName);
    }
  }

  /**
   * Updates the gender if provided in parameters.
   * @param information - User information parameters.
   */
  private updateGender(information: UserInformationParams): void {
    if (information.gender) {
      this.setGender(information.gender);
    }
  }

  /**
   * Updates the contact phone if provided in parameters.
   * @param information - User information parameters.
   */
  private updateContact(information: UserInformationParams): void {
    if (information.phone) {
      this.setContact(information.phone);
    }
  }

  /**
   * Updates the location if provided in parameters.
   * @param information - User information parameters.
   */
  private updateLocation(information: UserInformationParams): void {
    if (information.city && information.country) {
      this.setLocation(information.city, information.country);
    }
  }

  // Value Object Setters

  /**
   * Sets the full name using Value Object pattern.
   * @param firstName - First name (nullable).
   * @param lastName - Last name (nullable).
   */
  private setFullName(firstName: string | null, lastName: string | null): void {
    this._fullName = new FullName(firstName, lastName);
  }

  /**
   * Sets the gender using Value Object pattern.
   * @param gender - Gender string.
   */
  private setGender(gender: string): void {
    this._gender = new Gender(gender);
  }

  /**
   * Sets the contact phone using Value Object pattern.
   * @param phone - Phone number string.
   */
  private setContact(phone: string): void {
    this._phone = new Phone(phone);
  }

  /**
   * Sets the location using Value Object pattern.
   * @param country - Country name.
   * @param city - City name.
   */
  private setLocation(country: string, city: string): void {
    this._location = new Location(country, city);
  }

  get fullName() {
    if (!this._fullName || !this._fullName.value) {
      return null;
    }

    const { firstName = '', lastName = '' } = this._fullName.value;

    if (!firstName && !lastName) {
      return null;
    }

    return `${firstName} ${lastName}`.trim();
  }
}
