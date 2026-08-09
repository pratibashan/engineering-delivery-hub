import type { APIGatewayProxyEvent } from "aws-lambda";

import { handler as createProjectHandler } from "./handlers/createProject";
import { handler as getProjectsHandler } from "./handlers/getProjects";
import { handler as getProjectByIdHandler } from "./handlers/getProjectById";

const createEvent = {
  httpMethod: "POST",
  body: JSON.stringify({
    name: "Delivery Dashboard",
    status: "On Track",
    progress: 40,
  }),
} as unknown as APIGatewayProxyEvent;

const createResponse = await createProjectHandler(createEvent);

console.log("CREATE RESPONSE");
console.log(createResponse);

const createdProject = JSON.parse(createResponse.body);

const getAllEvent = {
  httpMethod: "GET",
} as unknown as APIGatewayProxyEvent;

const getAllResponse = await getProjectsHandler(getAllEvent);

console.log("GET ALL RESPONSE");
console.log(getAllResponse);

const getByIdEvent = {
  httpMethod: "GET",
  pathParameters: {
    id: createdProject.id,
  },
} as unknown as APIGatewayProxyEvent;

const getByIdResponse = await getProjectByIdHandler(getByIdEvent);

console.log("GET BY ID RESPONSE");
console.log(getByIdResponse);
