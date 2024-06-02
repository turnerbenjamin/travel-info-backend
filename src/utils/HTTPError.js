/**
 * Custom error class used to help avoid inadvertently sending
 * detailed error messages to users
 */
export default class HTTPError extends Error {
  #statusCode;
  #messageForUsers;
  constructor(statusCode, messageForUsers, innerMessage) {
    super(innerMessage || messageForUsers);
    this.#statusCode = statusCode;
    this.#messageForUsers = messageForUsers;
  }

  get statusCode() {
    return this.#statusCode;
  }
  get messageForUsers() {
    return this.#messageForUsers;
  }
}
