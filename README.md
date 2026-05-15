# message-hub

Minimal web app scaffold for the future chat product.

The first version intentionally contains only:

- Go HTTP server
- static SPA placeholder
- Docker image
- GitHub Actions build and deploy workflow
- `/healthz` endpoint for infra health checks

## Local run

```bash
go run ./cmd/server
```

Open `http://localhost:8080`.

## Docker

```bash
docker build -t message-hub-app .
docker run --rm -p 8080:8080 message-hub-app
```

## Deploy

Push to `master` builds `ghcr.io/vibes-group/message-hub-app:<sha>` and deploys
through `vibes-group/infra`.

Required repository secrets:

- `DEPLOY_HOST`
- `DEPLOY_SSH_KEY`
- `DEPLOY_HOST_KEY`
