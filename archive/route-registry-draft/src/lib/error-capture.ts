/**
 * CH Business Services - Error Capture & Handling
 * 
 * Implements spec Section 16: Security, resilience and privacy implementation
 * 
 * This provides comprehensive error handling following the operating platform specification.
 */

// Error codes per spec requirements
export enum ErrorCodes {
  // Authentication errors (Section 8)
  AUTH_REQUIRED = "AUTH_REQUIRED",
  AUTH_FAILED = "AUTH_FAILED",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  
  // API errors (Section 7)
  REQUEST_TOO_FAST = "REQUEST_TOO_FAST",
  RATE_LIMITED = "RATE_LIMITED",
  SUBMISSION_ALREADY_PROCESSED = "SUBMISSION_ALREADY_PROCESSED",
  
  // Security errors (Section 16)
  INVALID_INPUT = "INVALID_INPUT",
  FILE_SIZE_EXCEEDED = "FILE_SIZE_EXCEEDED",
  UNSUPPORTED_TYPE = "UNSUPPORTED_TYPE",
  FORGED_REQUEST = "FORGED_REQUEST",
  
  // Business operations
  SCOPE_INVALID = "SCOPE_INVALID",
  APPROVAL_REQUIRED = "APPROVAL_REQUIRED",
  PRIVILEGES_UNAUTHORIZED = "PRIVILEGES_UNAUTHORIZED",
}

/** Error response format following spec requirements */
export type ErrorResponse = {
  code: string;
  message: string;
  details?: any;
};

/** Generate error response based on error code */
export function generateErrorResponse(code: ErrorCodes, message?: string): ErrorResponse {
  const messages: Record<ErrorCodes, string> = {
    [ErrorCodes.AUTH_REQUIRED]: "Authentication is required for this action",
    [ErrorCodes.AUTH_FAILED]: "Authentication failed - please try again",
    [ErrorCodes.SESSION_EXPIRED]: "Your session has expired",
    [ErrorCodes.REQUEST_TOO_FAST]: "Request rate limited - try again later",
    [ErrorCodes.RATE_LIMITED]: "Submit too frequently - please retry in 60 seconds",
    [ErrorCodes.SUBMISSION_ALREADY_PROCESSED]: "This request was already processed. Please submit a new inquiry.",
    [ErrorCodes.INVALID_INPUT]: "Invalid input provided",
    [ErrorCodes.FILE_SIZE_EXCEEDED]: "File size exceeds maximum allowed limit",
    [ErrorCodes.UNSUPPORTED_TYPE]: "Unsupported file type - please use an alternative format",
    [ErrorCodes.FORGED_REQUEST]: "Request verification failed - possible manipulation detected",
    [ErrorCodes.SCOPE_INVALID]: "Invalid scope - contact support for clarification",
    [ErrorCodes.APPROVAL_REQUIRED]: "Approval required before proceeding",
    [ErrorCodes.PRIVILEGES_UNAUTHORIZED]: "Access denied - insufficient privileges",
  };

  return {
    code,
    message: message || messages[code],
    details: process.env.NODE_ENV === "production" ? null : {
      internal_code: code,
      timestamp: new Date().toISOString(),
    }
  };
}

/** Middleware error handler following spec Section 16 */
export function errorHandler(err: Error, req: Request, res: Response) {
  console.error("Error:", err.stack);
  
  // Check if this is an unauthorized route access attempt
  if (err.message === "Cannot GET /_server/ops") {
    return new Response(
      JSON.stringify({ error: "This endpoint requires authentication" }), 
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Rate limit exceeded (spec Section 7)
  if (req.headers.get("X-RateLimit-Remaining") === "0") {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded", message: "Too many requests" }), 
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Business logic errors
  if (err.message.includes("Invalid scope") || err.message.includes("scope")) {
    return new Response(
      JSON.stringify(generateErrorResponse(ErrorCodes.SCOPE_INVALID)), 
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  // Authentication errors (spec Section 8)
  if (err.name === "JsonWebTokenError" || err.message.includes("token")) {
    return new Response(
      JSON.stringify(generateErrorResponse(ErrorCodes.AUTH_FAILED)), 
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Database errors (spec Section 9 authorization)
  if (err.message.includes("permission") || err.message.includes("forbidden")) {
    return new Response(
      JSON.stringify(generateErrorResponse(ErrorCodes.PRIVILEGES_UNAUTHORIZED)), 
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // File upload errors (spec Section 16 security)
  if (err.message.includes("file") || err.message.includes("size")) {
    return new Response(
      JSON.stringify(generateErrorResponse(ErrorCodes.FILE_SIZE_EXCEEDED)), 
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }

  // Generic server error
  return new Response(
    JSON.stringify({ error: "Something went wrong", message: err.message || "Internal server error" }), 
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

/** Security logging following spec Section 16 */
export function logSecurityEvent(event: unknown) {
  // Track suspicious activities for audit (spec Section 9 authorization requirements)
  console.warn("SECURITY EVENT:", event);
}

export default {
  generateErrorResponse,
  errorHandler,
  logSecurityEvent,
};
