import { errors } from "@strapi/utils"

export type ErrorType = "NOT_FOUND_ERROR" | "APP_ERROR" |  "VALIDATION_ERROR" | "YUP_VALIDATION_ERROR" |
  "PAGINATION_ERROR" | "FORBIDDEN_ERROR" | "UNAUTH_ERROR" | "RATE_LIMIT_ERROR" | "PAYLOAD_LARGE_ERROR" |
  "POLICY_ERROR" | "NOT_IMPLEMENTED_ERROR";


export class ErrorFactory {
  protected errorInstance: Error;
  protected errorType: ErrorType;
  protected status: number;
  private details: unknown;

  constructor(type: ErrorType, message: string, details?: unknown) {
    this.errorType = type;
    this.errorInstance = this.createErrorInstance(message, details);
    this.details = details;
  }

  createErrorInstance(message: string, details?: unknown): Error {
    switch(this.errorType) {
      case "NOT_FOUND_ERROR":
        this.status = 404;
        return new errors.NotFoundError(message, details);

      case "VALIDATION_ERROR":
        this.status = 400;
        return new errors.ValidationError(message, details);

      case "APP_ERROR":
      default:
        return new errors.ApplicationError(message, details);
    }
  }
  
  getErrorInstance() {
    return this.errorInstance;
  }

  handleBadRequest(ctx: any) {
    if(this.status) {
      return ctx.throw(this.status, this.errorInstance.message)
    }

    return ctx.badRequest(this.errorInstance.message, this.details)
  }
}