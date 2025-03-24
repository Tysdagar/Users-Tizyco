/**
 * A wrapper class to standardize API responses.
 * Encapsulates the success status, optional message, and optional data payload.
 *
 * @template T - The type of the data payload in the response.
 */
export class Response<T> {
  /**
   * Indicates whether the operation succeeded.
   * Defaults to `true`.
   */
  public readonly succeeded: boolean = true;

  /**
   * An optional message providing additional context about the response.
   */
  public readonly message?: string;

  /**
   * The data payload associated with the response.
   */
  public readonly data?: T;

  /**
   * Private constructor for creating a `Response` instance.
   *
   * @param data - The data payload for the response, if any.
   * @param message - The message to include in the response, if any.
   */
  private constructor(data?: T, message?: string) {
    this.data = data;
    this.message = message;
  }

  /**
   * Creates a response with only a message.
   *
   * @param message - The message to include in the response.
   * @returns A `Response<string>` instance with the provided message.
   */
  public static message(message: string): Response<string> {
    return new Response<string>(undefined, message);
  }

  /**
   * Creates a response with only a data payload.
   *
   * @param data - The data payload for the response.
   * @returns A `Response<T>` instance with the provided data.
   */
  public static data<T>(data: T): Response<T> {
    return new Response<T>(data);
  }

  /**
   * Creates a complete response with both a message and a data payload.
   *
   * @param message - The message to include in the response.
   * @param data - The data payload for the response.
   * @returns A `Response<T>` instance with the provided message and data.
   */
  public static complete<T>(message: string, data: T): Response<T> {
    return new Response<T>(data, message);
  }
}
