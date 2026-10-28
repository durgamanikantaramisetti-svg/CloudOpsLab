# CloudOpsLab — DevOps CI/CD Project

CloudOpsLab is a hands-on DevOps portfolio project that automates the build, testing, containerization, deployment, and health verification of a Spring Boot REST API.

## Architecture

Developer → GitHub → Jenkins → Maven Build & Tests → Docker Image → Container Deployment → Health Check

## Technology Stack

- Java 21
- Spring Boot
- Maven
- Git and GitHub
- Jenkins
- Docker
- JUnit and Spring Boot Test

## CI/CD Pipeline

1. **Checkout:** Jenkins retrieves source code from GitHub.
2. **Build and Test:** Maven compiles the application and runs automated tests.
3. **Build Docker Image:** Jenkins creates the application Docker image.
4. **Deploy Application:** Jenkins replaces and starts the application container.
5. **Health Check:** Jenkins retries the health endpoint until the application responds or the check fails.
6. **Build Summary:** Jenkins reports the pipeline result.

A GitHub webhook is configured to trigger builds when code is pushed.

## API Endpoints

| Endpoint | Expected response |
| --- | --- |
| `/health` | `CloudOpsLab API is running` |
| `/students` | JSON list of three sample students |

The application runs locally on port `8082`.

## Run Locally

Prerequisites: Java 21 and Docker.

Build and test from the application directory:

```bash
cd app
chmod +x mvnw
./mvnw clean verify
```

Build the Docker image from the project root:

```bash
docker build -t cloudopslab-api:latest app
```

Run the container:

```bash
docker run -d --name cloudopslab-api-container -p 8082:8080 --restart unless-stopped cloudopslab-api:latest
```

Verify the endpoints:

```bash
curl http://localhost:8082/health
curl http://localhost:8082/students
```

## Skills Demonstrated

- Git and GitHub version control
- Jenkins pipeline automation
- Maven builds and automated testing
- Docker image creation and container deployment
- GitHub webhook integration
- Deployment health checks and retry logic
- CI/CD troubleshooting

## Project Status

**Completed:** GitHub integration, Jenkins CI/CD, Maven build and tests, Docker deployment, and automated health checks.

**Planned:** Terraform infrastructure, Kubernetes deployment, Prometheus and Grafana monitoring, and publishing the image to a container registry.

---

Created as a hands-on DevOps and Cloud Engineering learning project.
