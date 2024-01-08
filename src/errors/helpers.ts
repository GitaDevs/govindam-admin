import { errors } from "@strapi/utils"
import { DuplicateEntryError } from "./duplicate-entry";

export type ErrorType = "NOT_FOUND_ERROR" | "APP_ERROR" |  "VALIDATION_ERROR" | "YUP_VALIDATION_ERROR" |
  "PAGINATION_ERROR" | "FORBIDDEN_ERROR" | "UNAUTH_ERROR" | "RATE_LIMIT_ERROR" | "PAYLOAD_LARGE_ERROR" |
  "POLICY_ERROR" | "NOT_IMPLEMENTED_ERROR" | "DUPLICATE_ERROR";


export class ErrorFactory {
  private errorInstance: Error;
  private status: number;
  private details: unknown;

  constructor(type: ErrorType, message: string, details?: unknown) {
    this.errorInstance = this.createErrorInstance(type, message, details);
    this.details = details;
  }

  public getErrorInstance() {
    return this.errorInstance;
  }

  public handleBadRequest(ctx: any) {
    if(this.status) {
      return ctx.throw(this.status, this.errorInstance.message)
    }

    return ctx.badRequest(this.errorInstance.message, this.details)
  }

  private createErrorInstance(errorType: ErrorType,message: string, details?: unknown): Error {
    switch(errorType) {
      case "NOT_FOUND_ERROR":
        this.status = 404;
        return new errors.NotFoundError(message, details);

      case "VALIDATION_ERROR":
        this.status = 400;
        return new errors.ValidationError(message, details);

      // case "DUPLICATE_ERROR":
      //   this.status = 409;
      //   return new DuplicateEntryError(message, details);

      case "APP_ERROR":
      default:
        return new errors.ApplicationError(message, details);
    }
  }
}

export function handleError(error: ErrorFactory | Error, ctx) {
  if(error instanceof ErrorFactory) {
    return error.handleBadRequest(ctx)
  }

  throw error  
}