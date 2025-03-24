export class Multifactor {
  private constructor(
    private multifactorId: string,
    private contact: string,
    private active: boolean,
    private lastTimeUsed: Date,
  ) {
    this.multifactorId = multifactorId;
    this.contact = contact;
    this.active = active;
    this.lastTimeUsed = lastTimeUsed;
  }
}
