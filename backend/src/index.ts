import type { APIGatewayProxyEvent } from "aws-lambda";
import { handler as getProjectByIdHandler } from "./handlers/getProjectById";

const successEvent = {
  httpMethod: "GET",
  pathParameters: {
    id: "project-1",
  },
} as unknown as APIGatewayProxyEvent;

const notFoundEvent = {
  httpMethod: "GET",
  pathParameters: {
    id: "project-999",
  },
} as unknown as APIGatewayProxyEvent;

const successResponse = await getProjectByIdHandler(successEvent);
const notFoundResponse = await getProjectByIdHandler(notFoundEvent);

console.log("SUCCESS RESPONSE");
console.log(successResponse);

console.log("NOT FOUND RESPONSE");
console.log(notFoundResponse);
