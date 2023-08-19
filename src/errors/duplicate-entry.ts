import { ApplicationError } from "@strapi/utils/dist/errors";

class DuplicateEntryError extends ApplicationError {
  public details: unknown;
  public message: string;

  constructor(message: string, details: unknown) {
    super(message, details);
    this.name = 'ValidationError';
  }
}

export { DuplicateEntryError };