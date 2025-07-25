import { type NextFunction, type Response } from "express";
import { z } from "zod";
import * as constants from "../../core/constants";
import { ClientError, getErrorMessage } from "../../core/errors";
import type { SignInRequest } from "../../features/auth/auth.types";
import { errorResponseHandler } from "../http/httpErrorResponseHandler";

export const signInSchema = z.object({
  email: z
    .string()
    .email(constants.INVALID_EMAIL_MESSAGE)
    .trim(),
  password: z
    .string()
})

export const signInBodyValidation = async (
  request: SignInRequest,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = signInSchema.safeParse(request.body);

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}
