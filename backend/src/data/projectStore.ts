import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import type { Project } from "../types/project";

const client = new DynamoDBClient({});

const documentClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.PROJECTS_TABLE_NAME;

export async function getAllProjects(): Promise<Project[]> {
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME is not configured");
  }

  const response = await documentClient.send(
    new ScanCommand({
      TableName: tableName,
    }),
  );

  return (response.Items ?? []) as Project[];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME is not configured");
  }

  const response = await documentClient.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id,
      },
    }),
  );

  return response.Item as Project | undefined;
}

export async function saveProject(project: Project): Promise<void> {
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME is not configured");
  }

  await documentClient.send(
    new PutCommand({
      TableName: tableName,
      Item: project,
    }),
  );
}

export async function updateProject(project: Project): Promise<void> {
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME is not configured");
  }

  await documentClient.send(
    new PutCommand({
      TableName: tableName,
      Item: project,
      ConditionExpression: "attribute_exists(id)",
    }),
  );
}

export async function deleteProjectById(id: string): Promise<void> {
  if (!tableName) {
    throw new Error("PROJECTS_TABLE_NAME is not configured");
  }

  await documentClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id,
      },
      ConditionExpression: "attribute_exists(id)",
    }),
  );
}
