import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { deleteProject } from "../services/projectService";

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

  try {
    await deleteProject(projectId);

    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    };
  } catch (error) {
    console.error("Failed to delete project", error);

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
