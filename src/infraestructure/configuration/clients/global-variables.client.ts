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
   * @returns {string | undefined} The corresponding key, or undefined if not found.
   */
  public static getKey(value: string): string | undefined {
    const instance = GlobalVariablesClient.getInstance();

    return instance.enumVariablesMap.get(value);
  }
}
