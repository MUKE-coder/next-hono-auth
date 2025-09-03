import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const NotAuthorizedSchema = createMessageObjectSchema(
  HttpStatusPhrases.UNAUTHORIZED
);

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const NotFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
export const DeleteResponseSchema = createMessageObjectSchema(HttpStatusPhrases.OK);
