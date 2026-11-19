/**
 * A specific error that tells the UI "this API function is not written yet".
 *
 * Every placeholder API function throws this error. Pages catch it and show a
 * calm "integration pending" message instead of pretending a request worked.
 */
export class ApiNotImplementedError extends Error {
  readonly functionName: string;

  constructor(functionName: string) {
    super(
      `API_NOT_IMPLEMENTED: ${functionName}. Open src/lib/api and add the request.`,
    );
    this.name = "ApiNotImplementedError";
    this.functionName = functionName;
  }
}

export function isApiNotImplementedError(
  error: unknown,
): error is ApiNotImplementedError {
  return error instanceof ApiNotImplementedError;
}

export const API_PENDING_MESSAGE =
  "This screen is ready, but its API function is not implemented yet. Add the request in src/lib/api, then reconnect this component.";
