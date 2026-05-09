import { NODE_ENV } from "../../../config/config.service.js";

const normalizeMessage = (message) =>
  typeof message === "string" ? message : message?.message || "Error";

export const errorResponse = ({
  statusCode = 400,
  message = "Error",
  extra = undefined,
}) => {
  const error = new Error(normalizeMessage(message));
  error.statusCode = statusCode;
  error.extra = extra;
  throw error;
};

export const BadRequestException = (message = "Bad Request", extra = undefined) =>
  errorResponse({ statusCode: 400, message, extra });

export const ConflictException = (message = "Conflict", extra = undefined) =>
  errorResponse({ statusCode: 409, message, extra });

export const UnauthorizedException = (message = "Unauthorized", extra = undefined) =>
  errorResponse({ statusCode: 401, message, extra });

export const NotFoundException = (message = "Not Found", extra = undefined) =>
  errorResponse({ statusCode: 404, message, extra });

export const ForbiddenException = (message = "Forbidden", extra = undefined) =>
  errorResponse({ statusCode: 403, message, extra });

export const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const response = {
    message: error.message || "Internal Server Error",
    statusCode,
    extra: error.extra,
  };

  if (NODE_ENV !== "production") {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

