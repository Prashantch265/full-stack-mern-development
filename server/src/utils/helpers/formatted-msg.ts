import * as util from "util";

/**
 * Interface for the error object passed to the formatter.
 */
interface IFormattedError {
  message: string;
  source?: string | string[]; // Source can be a single string or an array of strings
}

/**
 * Type definition for the error message map.
 * It's a dictionary with string keys and string values.
 */
type ErrorMessageMap = {
  [key: string]: string;
};

/**
 * Formats an error message using a template from a message map.
 *
 * @param {IFormattedError} err - The error object containing the message key and source.
 * @param {ErrorMessageMap} errorMsg - The map of error message templates.
 * @returns {string} The formatted error message.
 */
const formattedMsg = (err: IFormattedError, errorMsg: ErrorMessageMap): string => {
  const messageTemplate = errorMsg[err.message] ?? err.message; // Fallback to the original message

  if (err.source) {
    // Ensure the source is an array for the spread operator
    const sourceArgs = Array.isArray(err.source) ? err.source : [err.source];
    return util.format(messageTemplate, ...sourceArgs);
  }

  return messageTemplate;
};

export default formattedMsg;
