import { createNamespace, getNamespace, Namespace } from 'cls-hooked';

const NAMESPACE_NAME = 'request-context';

export class RequestContextService {
  private static getNamespace(): Namespace {
    let namespace = getNamespace(NAMESPACE_NAME);
    if (!namespace) {
      namespace = createNamespace(NAMESPACE_NAME);
    }
    return namespace;
  }

  static run(callback: (...args: any[]) => void) {
    this.getNamespace().run(callback);
  }

  static set<T>(key: string, value: T) {
    this.getNamespace().set(key, value);
  }

  static get<T>(key: string): T {
    return this.getNamespace().get(key) as T;
  }
}
