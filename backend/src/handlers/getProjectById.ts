import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getProjectById } from "../services/projectService";

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

  const project = await getProjectById(projectId);

  if (!project) {
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

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  };
}
