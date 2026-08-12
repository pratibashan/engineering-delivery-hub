import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { updateProjectSchema } from "../schemas/projectSchema";
import { updateExistingProject } from "../services/projectService";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const projectId = event.pathParameters?.id;

  if (!projectId) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Project id is required",
      }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Invalid JSON body",
      }),
    };
  }

  const validationResult = updateProjectSchema.safeParse(requestBody);

  if (!validationResult.success) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Invalid project data",
        errors: validationResult.error.flatten().fieldErrors,
      }),
    };
  }

  try {
    const project = await updateExistingProject({
      id: projectId,
      ...validationResult.data,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    };
  } catch (error) {
    console.error("Failed to update project", error);

    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Project not found",
      }),
    };
  }
}
