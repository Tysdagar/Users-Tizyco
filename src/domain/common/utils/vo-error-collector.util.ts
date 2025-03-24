import { ValidationError } from '../errors/validation.error';
import { Failure } from '../interfaces/custom-validator.interface';

/**
 * A singleton class to collect and manage value object validation errors.
 * Provides utilities to add, retrieve, clear, and trigger validation errors.
 */
export class ValueObjectErrorCollector {
  /**
   * Array to store validation failures.
   */
  private static errors: Failure[] = [];

  /**
   * Singleton instance of `ValueObjectErrorCollector`.
   */
  private static instance: ValueObjectErrorCollector;

  /**
   * Private constructor to enforce singleton pattern.
   */
  private constructor() {}

  /**
   * Retrieves the singleton instance of `ValueObjectErrorCollector`.
   *
   * @returns The singleton instance of the error collector.
   */
  static getInstance(): ValueObjectErrorCollector {
    if (!ValueObjectErrorCollector.instance) {
      ValueObjectErrorCollector.instance = new ValueObjectErrorCollector();
    }
    return ValueObjectErrorCollector.instance;
  }

  /**
   * Adds a new error to the collector.
   *
   * @param field - The name of the field causing the error.
   * @param message - The error message describing the validation failure.
   */
  static addError(field: string, message: string): void {
    ValueObjectErrorCollector.errors.push({ field, message });
  }

  /**
   * Checks if any errors have been collected.
   *
   * @returns `true` if errors exist, otherwise `false`.
   */
  static hasErrors(): boolean {
    return ValueObjectErrorCollector.errors.length > 0;
  }

  /**
   * Retrieves the list of collected errors.
   *
   * @returns An array of `Failure` objects representing validation errors.
   */
  static getErrors(): Failure[] {
    return [...ValueObjectErrorCollector.errors];
  }

  /**
   * Clears all collected errors.
   */
  static clear(): void {
    ValueObjectErrorCollector.errors = [];
  }

  /**
   * Triggers validation by throwing a `ValidationError` if any errors exist.
   * Clears the error collector after throwing.
   *
   * @throws `ValidationError` containing all collected validation errors.
   */
  static triggerValidation(): void {
    if (ValueObjectErrorCollector.hasErrors()) {
      const errors = ValueObjectErrorCollector.getErrors();
      ValueObjectErrorCollector.clear();
      throw new ValidationError(errors);
    }
    return;
  }
}
