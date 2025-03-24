export class UserInformation {
  private constructor(
    private firstName?: string,
    private lastName?: string,
    private country?: string,
    private gender?: string,
    private city?: string,
    private phonePreFix?: number,
    private phone?: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.gender = gender;
    this.city = city;
    this.phonePreFix = phonePreFix;
    this.phone = phone;
  }
}
