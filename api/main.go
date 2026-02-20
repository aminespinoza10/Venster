package main

import (
	"log"
	"net/http"
	"os"

	"github.com/aminespinoza10/venster/api/handlers"
	"github.com/aminespinoza10/venster/api/middleware"
	"github.com/aminespinoza10/venster/api/services"
	"github.com/gorilla/mux"
)

func main() {
	// Initialize Ollama service
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	ollamaService := services.NewOllamaService(ollamaURL)

	// Initialize handlers
	chatHandler := handlers.NewChatHandler(ollamaService)
	healthHandler := handlers.NewHealthHandler()

	// Setup router
	router := mux.NewRouter()

	// Apply middleware
	router.Use(middleware.CORS)
	router.Use(middleware.Logger)

	// Routes
	router.HandleFunc("/health", healthHandler.Check).Methods("GET")
	router.HandleFunc("/api/chat", chatHandler.Chat).Methods("POST")
	router.HandleFunc("/api/models", chatHandler.ListModels).Methods("GET")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Ollama URL: %s", ollamaURL)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}
}
