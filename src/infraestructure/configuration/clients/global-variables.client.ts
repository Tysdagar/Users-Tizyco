import { DomainException } from 'src/domain/common/errors/configuration/domain.exception';
import { StateVariableMap } from 'src/domain/common/interfaces/services/state-sync.interface';

/**
 * GlobalVariablesClient provides a singleton instance to manage global state variables.
 */
export class GlobalVariablesClient {
  private static instance: GlobalVariablesClient;
  private enumVariablesMap: StateVariableMap = new Map();

  private constructor() {}

  /**
   * Retrieves the singleton instance of GlobalVariablesClient.
   * @returns {GlobalVariablesClient} The singleton instance.
   */
  private static getInstance(): GlobalVariablesClient {
    if (!GlobalVariablesClient.instance) {
      GlobalVariablesClient.instance = new GlobalVariablesClient();
    }
    return GlobalVariablesClient.instance;
  }

  /**
   * Saves variables into the global state map.
   * @param {StateVariableMap} variables - The variables to save.
   */
  public static saveVariables(variables: StateVariableMap): void {
    const instance = GlobalVariablesClient.getInstance();

    for (const [key, value] of variables) {
      instance.enumVariablesMap.set(key, value);
    }
  }

  /**
   * Retrieves the key corresponding to a value from the state map.
   * @param {string} value - The value to search for.
   * @returns {string} The corresponding key, or @throws error if not found.
   */
  public static getKey(value: string): string {
    const instance = GlobalVariablesClient.getInstance();
    const key = instance.enumVariablesMap.get(value.toLowerCase());

    if (!key)
      throw new DomainException(
        `No se ha configurado en la base de datos la key ${value}`,
      );

    return key;
  }
}
