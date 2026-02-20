# Venster API

Go backend API for Venster - an Ollama chat interface.

## Getting Started

### Prerequisites

- Go 1.21 or higher
- Ollama running locally or remotely

### Installation

1. Install dependencies:
```bash
go mod download
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration (optional)

### Running the API

```bash
go run main.go
```

The API will start on `http://localhost:8080` by default.

## API Endpoints

### Health Check
```
GET /health
```

### Chat
```
POST /api/chat
Content-Type: application/json

{
  "model": "llama3.2",
  "messages": [
    {
      "role": "user",
      "content": "Hello!"
    }
  ]
}
```

### List Models
```
GET /api/models
```

## Environment Variables

- `PORT` - Server port (default: 8080)
- `OLLAMA_URL` - Ollama server URL (default: http://localhost:11434)

## Project Structure

```
api/
├── main.go              # Application entry point
├── handlers/            # HTTP request handlers
├── services/            # Business logic
├── models/              # Data structures
└── middleware/          # HTTP middleware
```
