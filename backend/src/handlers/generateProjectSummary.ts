import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

import { getProjectById } from "../services/projectService";

const bedrockClient = new BedrockRuntimeClient({
  region: "us-east-2",
});

const modelId = "us.anthropic.claude-sonnet-4-6";

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

  const prompt = `
You are an engineering delivery assistant.

Analyze the following software project using only the information provided.

Project name: ${project.name}
Status: ${project.status}
Progress: ${project.progress}%
Description: ${project.description ?? "Not provided"}
Blockers: ${project.blockers ?? "None reported"}

Provide:

1. A concise delivery summary.
2. The main delivery risks.
3. The highest-priority recommended next actions.

Use only the project information provided above.

Do not invent facts, blockers, dependencies, deadlines, technical risks, or project circumstances that are not explicitly supported by the provided data.

Do not infer domain-specific risks based only on the project name.

If important information is missing, clearly identify it as missing rather than guessing.

Provide recommendations based only on the available project information.

Formatting requirements:
- Use Markdown.
- Do not use Markdown tables.
- Use bullet points for delivery risks.
- Use a numbered list for recommended next actions.
- Keep headings short and clear.
- Keep the response concise and useful for an engineering manager.
`;

  try {
    const command = new ConverseCommand({
      modelId,
      messages: [
        {
          role: "user",
          content: [
            {
              text: prompt,
            },
          ],
        },
      ],
      inferenceConfig: {
        maxTokens: 500,
        temperature: 0.2,
      },
    });

    const response = await bedrockClient.send(command);

    const summary = response.output?.message?.content?.[0]?.text;

    if (!summary) {
      throw new Error("Claude returned an empty response");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project.id,
        summary,
      }),
    };
  } catch (error) {
    console.error("Failed to generate project summary", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Unable to generate project summary",
      }),
    };
  }
}
