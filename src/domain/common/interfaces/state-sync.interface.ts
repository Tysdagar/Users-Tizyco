/**
 * Represents a state variable with an identifier and its corresponding value.
 */
export type StateVariable = {
  /**
   * The unique identifier of the state variable.
   */
  id: string;

  /**
   * The value associated with the state variable.
   */
  value: string;
};

/**
 * A map representation for storing state variables,
 * where the key is the state variable ID and the value is its associated value.
 */
export type StateVariableMap = Map<string, string>;

/**
 * Symbol used for identifying the State DAO Sync in dependency injection.
 */
export const STATE_DAO_SYNC = Symbol('IStateDAOSync');

/**
 * Interface for a State DAO Sync, responsible for managing state variables
 * in a synchronized manner.
 */
export interface IStateDAOSync {
  /**
   * Retrieves all state variables from the storage.
   *
   * @returns A promise that resolves to an array of `StateVariable` objects.
   *
   * @example
   * ```typescript
   * const stateVariables = await stateDAOSync.findAll();
   * console.log(stateVariables);
   * ```
   */
  findAll(): Promise<StateVariable[]>;

  /**
   * Saves a range of state variable values to the storage.
   *
   * @param values - An array of strings representing the state variable values to save.
   * @returns A promise that resolves once the values have been saved.
   *
   * @example
   * ```typescript
   * await stateDAOSync.saveRange(['value1', 'value2']);
   * console.log('Values saved successfully.');
   * ```
   */
  saveRange(values: string[]): Promise<void>;
}
