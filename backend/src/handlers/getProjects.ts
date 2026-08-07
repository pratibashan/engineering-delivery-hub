import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getAllProjects } from "../services/projectService";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  console.log("Received request:", event.httpMethod);

  const projects = getAllProjects();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projects),
  };
}
