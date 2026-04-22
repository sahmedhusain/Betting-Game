FROM golang:1.26-alpine AS builder

WORKDIR /src

RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

FROM alpine:3.22

WORKDIR /app

ARG BACKEND_PORT=8080

RUN addgroup -S app && adduser -S -G app app \
	&& apk add --no-cache ca-certificates tzdata \
	&& update-ca-certificates

COPY --from=builder /out/server /app/server

ENV BACKEND_PORT=${BACKEND_PORT}

EXPOSE ${BACKEND_PORT}

USER app

CMD ["/app/server"]
