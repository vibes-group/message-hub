FROM golang:1.26-bookworm AS build

WORKDIR /src

COPY go.mod ./
COPY cmd ./cmd

RUN --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux \
    go build -ldflags="-s -w" -o /out/message-hub-app ./cmd/server

FROM debian:12-slim

RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates wget \
 && rm -rf /var/lib/apt/lists/* \
 && groupadd -r app && useradd -r -g app -u 10001 -d /app -s /sbin/nologin app

WORKDIR /app

COPY --from=build /out/message-hub-app /app/message-hub-app
COPY web /app/web

ENV APP_ADDR=:8080
ENV WEB_DIR=/app/web

EXPOSE 8080

USER app:app

CMD ["/app/message-hub-app"]
