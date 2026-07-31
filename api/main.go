// @title           Venster API
// @version         1.0
// @description     API server for Venster, a chat interface powered by Ollama.
// @host            localhost:8080
// @BasePath        /

package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/aminespinoza10/venster/api/docs"
	"github.com/aminespinoza10/venster/api/handlers"
	"github.com/aminespinoza10/venster/api/middleware"
	"github.com/aminespinoza10/venster/api/services"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
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
	router.HandleFunc("/api/tags", chatHandler.ListModels).Methods("GET")
	router.HandleFunc("/api/chatModels", chatHandler.ChatModels).Methods("GET")
	router.HandleFunc("/api/embedding", chatHandler.EmbeddingModels).Methods("GET")

	// Swagger UI
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Ollama URL: %s", ollamaURL)
	log.Printf("Open API endpoint: http://localhost:%s/swagger/", port)

	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}
}
