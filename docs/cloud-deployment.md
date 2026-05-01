# Cloud Deployment Automation

MoodFLOW is deployed on Render. This branch adds cloud deployment automation for the public cloud assignment.

## Infrastructure as Code

The `render.yaml` file defines the Render services used by the project. It describes the frontend and backend services, their root directories, build commands, start commands, and environment variable names.

Sensitive values are not committed to the repository. Secret values must be configured in Render and GitHub Actions.

## CI/CD Deployment

The `.github/workflows/render-deploy.yml` workflow builds the frontend and backend before deployment. If the build succeeds, the workflow triggers Render deployment using deploy hook URLs stored in GitHub Actions secrets.

Required GitHub Secrets:
- `RENDER_FRONTEND_DEPLOY_HOOK_URL`
- `RENDER_BACKEND_DEPLOY_HOOK_URL`

## Assignment Mapping

- Infrastructure provisioning code: `render.yaml`
- Infrastructure/deployment automation: GitHub Actions workflow
- Application build/package/deploy automation: GitHub Actions build job and Render deploy hook trigger
