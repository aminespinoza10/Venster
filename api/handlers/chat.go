package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/aminespinoza10/venster/api/models"
	"github.com/aminespinoza10/venster/api/services"
)

type ChatHandler struct {
	ollamaService *services.OllamaService
}

func NewChatHandler(ollamaService *services.OllamaService) *ChatHandler {
	return &ChatHandler{
		ollamaService: ollamaService,
	}
}

// Chat handles chat requests
func (h *ChatHandler) Chat(w http.ResponseWriter, r *http.Request) {
	var req models.ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	// Validate request
	if req.Model == "" {
		req.Model = "llama3.2"
	}
	if len(req.Messages) == 0 {
		respondWithError(w, http.StatusBadRequest, "No messages provided", nil)
		return
	}

	// Call Ollama service
	response, err := h.ollamaService.Chat(req.Messages, req.Model)
	if err != nil {
		log.Printf("Error calling Ollama: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to get response from Ollama", err)
		return
	}

	// Send response
	respondWithJSON(w, http.StatusOK, models.ChatResponse{
		Response: response,
		Model:    req.Model,
	})
}

// ListModels returns available Ollama models
func (h *ChatHandler) ListModels(w http.ResponseWriter, r *http.Request) {
	models, err := h.ollamaService.ListModels()
	if err != nil {
		log.Printf("Error listing models: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to list models", err)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"models": models,
	})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Failed to marshal response"))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string, err error) {
	errResp := models.ErrorResponse{
		Error: message,
	}
	if err != nil {
		errResp.Message = err.Error()
	}
	respondWithJSON(w, code, errResp)
}
