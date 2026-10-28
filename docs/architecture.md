# CloudOpsLab Architecture

## Overview

CloudOpsLab automates the build, testing, containerization, deployment, and health verification of a Spring Boot REST API.

## Architecture Diagram

```mermaid
flowchart TD
    A[Developer] -->|Push code| B[GitHub Repository]
    B -->|Webhook triggers build| C[Jenkins Pipeline]
    C --> D[Maven Build and Tests]
    D --> E[Build Docker Image]
    E --> F[Deploy Docker Container]
    F --> G[Application Health Check]
    G --> H[Spring Boot REST API]
```

## Pipeline Stages

1. GitHub stores the source code.
2. Jenkins checks out the latest code.
3. Maven builds the application and runs tests.
4. Docker builds the application image.
5. Jenkins deploys the Docker container.
6. Jenkins verifies application health.

## Application Endpoints

- `/health` - Checks application availability.
- `/students` - Returns sample student data.

Application URL: http://localhost:8082

## Technologies Used

Java 21, Spring Boot, Maven, Git, GitHub, Jenkins, Docker, JUnit, and GitHub Webhooks.
