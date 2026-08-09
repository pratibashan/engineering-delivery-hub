import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { createProjectSchema } from "../schemas/projectSchema";
import { createProject } from "../services/projectService";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Request body is required",
      }),
    };
  }

  let requestBody: unknown;

  try {
    requestBody = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON body",
      }),
    };
  }

  const validationResult = createProjectSchema.safeParse(requestBody);

  if (!validationResult.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid project data",
        errors: validationResult.error.flatten().fieldErrors,
      }),
    };
  }

  const project = await createProject(validationResult.data);

  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  };
}
