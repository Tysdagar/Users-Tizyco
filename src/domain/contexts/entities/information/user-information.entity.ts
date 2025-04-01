import { type UserInformationParams } from '../../types/user';
import { Phone } from './value-objects/phone.vo';
import { FullName } from './value-objects/full-name.vo';
import { Gender } from './value-objects/gender.vo';
import { Location } from './value-objects/location.vo';
import { INFO_EXCEPTION_FACTORY } from './exceptions/information-exception.factory';

export class UserInformation {
  private fullName: FullName | null = null;
  private gender: Gender | null = null;
  private phone: Phone | null = null;
  private location: Location | null = null;

  private constructor() {}

  public static initialize(): UserInformation {
    return new UserInformation();
  }

  public static build(information: UserInformationParams): UserInformation {
    const userInfo = this.initialize();

    userInfo.updateFullName(information);
    userInfo.updateGender(information);
    userInfo.updateContact(information);
    userInfo.updateLocation(information);

    return userInfo;
  }

  public update(information: UserInformationParams): void {
    if (!this.canUpdateInformation(information)) {
      INFO_EXCEPTION_FACTORY.throw('NO_INFORMATION_PROPERTIES_TO_UPDATE');
    }

    this.updateFullName(information);
    this.updateGender(information);
    this.updateContact(information);
    this.updateLocation(information);
  }

  private canUpdateInformation(information: UserInformationParams): boolean {
    return Object.values(information).some((value) => value !== undefined);
  }

  private updateFullName(information: UserInformationParams): void {
    if (information.firstName || information.lastName) {
      this.setFullName(information.firstName, information.lastName);
    }
  }

  private updateGender(information: UserInformationParams): void {
    if (information.gender) {
      this.setGender(information.gender);
    }
  }

  private updateContact(information: UserInformationParams): void {
    if (information.phone) {
      this.setContact(information.phone);
    }
  }

  private updateLocation(information: UserInformationParams): void {
    if (information.city && information.country) {
      this.setLocation(information.city, information.country);
    }
  }

  private setFullName(firstName: string | null, lastName: string | null): void {
    this.fullName = new FullName(firstName, lastName);
  }

  private setGender(gender: string): void {
    this.gender = new Gender(gender);
  }

  private setContact(phone: string): void {
    this.phone = new Phone(phone);
  }

  private setLocation(country: string, city: string): void {
    this.location = new Location(country, city);
  }
}
