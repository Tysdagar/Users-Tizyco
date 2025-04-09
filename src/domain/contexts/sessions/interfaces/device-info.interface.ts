export const FINGERPRINT_SERVICE = Symbol('IFingerPrintService');

export interface IFingerPrintService {
  getHash(): string;
  getEncrypted(): string;
}
