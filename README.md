# CloudOpsLab — DevOps CI/CD Project

CloudOpsLab is a hands-on DevOps portfolio project that automates the build, testing, containerization, deployment, and health verification of a Spring Boot REST API.

The project demonstrates a CI/CD pipeline using Jenkins and GitHub, Docker container deployment, and local Kubernetes orchestration.

## Architecture

Developer → GitHub → GitHub Webhook → Jenkins → Maven Build & Tests → Docker Image → Deployment → Health Check

Kubernetes deployment:

Docker Hub Image → Kubernetes Deployment → 3 Application Pods → Kubernetes Service

## Technology Stack

- Java 21
- Spring Boot
- Maven
- Git and GitHub
- Jenkins
- Docker and Docker Hub
- Kubernetes
- YAML
- JUnit and Spring Boot Test

## CI/CD Pipeline

1. **Checkout:** Jenkins retrieves source code from GitHub.
2. **Build and Test:** Maven compiles the application and runs automated tests.
3. **Build Docker Image:** Jenkins creates the application Docker image.
4. **Publish Image:** The pipeline publishes versioned and latest image tags to Docker Hub.
5. **Deploy Application:** Jenkins starts the application container.
6. **Health Check:** Jenkins checks the application health endpoint.
7. **Build Summary:** Jenkins reports the pipeline result.

A GitHub webhook triggers the Jenkins pipeline when code is pushed.

## Application API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `/health` | Checks application health |
| `/students` | Returns a JSON list of three sample students |
| `/build-info` | Returns build information |

### Local Docker deployment

The original Docker deployment runs on port `8082`.

- Health: http://localhost:8082/health
- Students: http://localhost:8082/students
- Build information: http://localhost:8082/build-info

Example response from `/health`:

```text
CloudOpsLab API is running
```

## Kubernetes Deployment

Kubernetes manifests are stored in the `k8s/` directory.

- `k8s/deployment.yaml` defines the application Deployment with three replicas.
- `k8s/service.yaml` defines a ClusterIP Service on port 8080.
- Startup, liveness, and readiness probes check the `/health` endpoint.
- Kubernetes replaces a Pod if it is deleted, maintaining the desired replica count.

The project was tested locally using the Kubernetes cluster provided by Docker Desktop.

### Apply Kubernetes manifests

Prerequisites: Docker Desktop with Kubernetes enabled and `kubectl` installed.

From the project root:

```bash
kubectl config current-context
kubectl apply -f k8s/
kubectl rollout status deployment/cloudopslab-api
kubectl get pods -l app=cloudopslab-api
kubectl get services
```

### Access the Kubernetes application

Start port forwarding:

```bash
kubectl port-forward service/cloudopslab-api-service 8083:8080
```

Keep that terminal running. Open another terminal and test:

```bash
curl http://localhost:8083/health
curl http://localhost:8083/students
curl http://localhost:8083/build-info
```

Port `8083` is a local port-forward and is available only while the command is running. The original Docker deployment on port `8082` is separate.

### Scale the application

```bash
kubectl scale deployment/cloudopslab-api --replicas=3
kubectl get pods -l app=cloudopslab-api
```

### Remove the Kubernetes resources

To remove the resources created by these manifests:

```bash
kubectl delete -f k8s/
```

This removes the Kubernetes Deployment and Service. It does not remove the separate Docker container running on port `8082`.

## Run the Application Locally

Prerequisites: Java 21 and Docker.

Build and test:

```bash
cd app
chmod +x mvnw
./mvnw clean verify
cd ..
```

Build the Docker image:

```bash
docker build -t cloudopslab-api:latest app
```

Run the container if that container name is not already in use:

```bash
docker run -d --name cloudopslab-api-container \
  -p 8082:8080 \
  --restart unless-stopped \
  cloudopslab-api:latest
```

Test the application:

```bash
curl http://localhost:8082/health
curl http://localhost:8082/students
```

## Skills Demonstrated

- Git and GitHub version control
- Jenkins CI/CD pipeline automation
- GitHub webhook integration
- Maven builds and automated testing
- Docker image creation and container deployment
- Docker Hub image publishing
- Kubernetes Deployments and Services
- Kubernetes replicas and self-healing
- Startup, liveness, and readiness probes
- Application health checks
- CI/CD troubleshooting

## Project Status

**Implemented and tested:**
- GitHub source control and webhook-triggered Jenkins builds
- Maven build and automated tests
- Docker image build and application deployment
- Docker Hub image publishing
- Automated health checks
- Local Kubernetes deployment with three replicas
- Kubernetes Service and health probes
- Pod replacement and replica verification

**Potential future improvements:**
- Terraform infrastructure automation
- Prometheus and Grafana monitoring
- Additional integration tests and security scanning

---

Created as a hands-on DevOps and Cloud Engineering learning project.
