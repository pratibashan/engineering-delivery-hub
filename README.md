# Engineering Delivery Hub

Engineering Delivery Hub is a full-stack application for tracking engineering initiatives, monitoring delivery health, identifying blockers, and generating AI-powered project insights.

Built with Next.js, TypeScript, and AWS serverless services, the application combines project management, secure authentication, protected APIs, cloud persistence, and generative AI in an end-to-end architecture.

## Overview

Engineering Delivery Hub provides authenticated users with a centralized dashboard for managing engineering projects and understanding delivery health.

Users can create and manage projects, track status and progress, document blockers, and generate AI-assisted delivery insights that highlight risks and recommend next actions.

The application brings together frontend development, protected backend APIs, authentication, cloud infrastructure, persistent storage, and generative AI.

## Key Features

- Create, view, update, and delete engineering projects
- Track project status and completion progress
- Capture project descriptions and blockers
- Authenticate users with Amazon Cognito
- Protect application routes and backend APIs
- Automatically refresh expired access tokens for interactive requests
- Generate AI-powered delivery summaries
- Identify project risks and blockers
- Generate recommended next actions
- View the application architecture
- Deploy backend infrastructure using AWS SAM

## Architecture

The application uses Next.js for the web application and as a Backend for Frontend (BFF) layer between the browser and AWS services.

```text
                         Amazon Cognito
                        Authentication
                              |
                              v
User / Browser <-------- Next.js Application
                              |
                              v
                    Next.js Route Handlers
                           (BFF)
                              |
                              | Access Token
                              v
                     Amazon API Gateway
                              |
                       JWT Authorizer
                              |
                              v
                         AWS Lambda
                         /          \
                        v            v
                  DynamoDB      Amazon Bedrock
                                      |
                                      v
                              Claude Sonnet 4.6
```

Amazon Cognito handles user authentication and token issuance.

For protected backend operations, the Next.js layer forwards the access token to API Gateway. API Gateway validates the JWT before routing authorized requests to Lambda.

Lambda functions implement the backend application logic, using DynamoDB for project persistence and Amazon Bedrock for AI-powered delivery analysis.

A dedicated `/architecture` page provides an in-app view of the system design.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Next.js App Router
- Server and Client Components
- Next.js Route Handlers

### Backend

- Node.js
- TypeScript
- AWS Lambda
- REST-style APIs

### AWS

- Amazon Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon Bedrock
- AWS IAM
- AWS SAM
- AWS CloudFormation

### Generative AI

- Amazon Bedrock
- Anthropic Claude Sonnet 4.6
- Prompt-based project delivery analysis

## Authentication & Security

Authentication is implemented with Amazon Cognito using an authorization-code-based sign-in flow.

Authentication tokens are stored in HttpOnly cookies, keeping them inaccessible to normal client-side JavaScript.

Next.js Route Handlers provide a BFF layer for interactive browser operations and securely forward access tokens to the AWS backend.

Protected requests follow this flow:

```text
Browser
   |
   v
Next.js BFF
   |
   | Authorization: Bearer <access_token>
   v
API Gateway
   |
   | JWT validation
   v
Lambda
```

Interactive API requests also support access-token renewal. If a protected request returns `401 Unauthorized`, the application uses the refresh token to request a new access token from Cognito and retries the original request once.

```text
Protected Request
      |
      v
401 Unauthorized
      |
      v
Refresh Endpoint
      |
      v
Amazon Cognito
      |
      v
New Access Token
      |
      v
Retry Original Request
```

Security considerations include:

- Amazon Cognito authentication
- HttpOnly authentication cookies
- API Gateway JWT authorization
- Protected backend endpoints
- Server-side token forwarding
- Refresh-token handling
- Least-privilege IAM permissions
- Restricted Bedrock invocation permissions
- Authorization configuration managed through Infrastructure as Code

## AI Integration

Engineering Delivery Hub uses Amazon Bedrock with Anthropic Claude Sonnet 4.6 to analyze project delivery information.

When a user selects **Generate AI Insight**, project context such as status, progress, description, and blockers is sent through the secured backend for analysis.

The generated insight can include:

- Delivery summary
- Key delivery risks
- Recommended next actions
- Identification of missing information that may affect the delivery assessment

```text
Generate AI Insight
        |
        v
Next.js BFF
        |
        v
API Gateway
        |
        v
Lambda
        |
        +----> DynamoDB
        |
        v
Amazon Bedrock
        |
        v
Claude Sonnet 4.6
        |
        v
Delivery Insight
```

AI generation is performed on demand rather than during every project request, helping limit unnecessary model invocations.

## API Endpoints

| Method   | Endpoint                 | Description                     |
| -------- | ------------------------ | ------------------------------- |
| `GET`    | `/projects`              | Retrieve all projects           |
| `GET`    | `/projects/{id}`         | Retrieve a project              |
| `POST`   | `/projects`              | Create a project                |
| `PUT`    | `/projects/{id}`         | Update a project                |
| `DELETE` | `/projects/{id}`         | Delete a project                |
| `POST`   | `/projects/{id}/summary` | Generate an AI delivery insight |

Project endpoints are protected by the API Gateway JWT authorizer.

## Project Structure

```text
engineering-delivery-hub/
│
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   └── projects/
│   │   │   ├── architecture/
│   │   │   └── dashboard/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── handlers/
│   │   └── services/
│   ├── template.yaml
│   └── package.json
│
└── README.md
```

The `web` directory contains the Next.js frontend and BFF routes.

The `backend` directory contains Lambda handlers, backend services, and the AWS SAM infrastructure definition.

## Running Locally

### Frontend

```bash
cd web
npm install
npm run dev
```

The development application runs at:

```text
http://localhost:3000
```

Frontend validation:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

### Backend

```bash
cd backend
npm install
sam validate --lint
sam build
```

Local AWS and Cognito configuration must be provided through the appropriate environment configuration.

Secrets and other sensitive configuration values should not be committed to source control.

## Future Improvements

Potential next steps include:

- Automated unit and integration testing
- CI/CD pipeline
- Production frontend deployment
- Enhanced CloudWatch logging and observability
- Structured AI responses with schema validation
- AI insight persistence and caching
- API rate limiting
- Role-based authorization
- Per-user or per-team project ownership
- Enhanced token refresh for server-rendered requests
- AI usage and cost monitoring
- Prompt versioning
