package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/aminespinoza10/venster/api/models"
	"github.com/aminespinoza10/venster/api/services"
)

// ChatModels godoc
// @Summary      List chat-capable models
// @Description  Returns available Ollama models filtered to those with completion capability
// @Tags         models
// @Produce      json
// @Success      200  {object}  map[string]interface{}
// @Failure      500  {object}  models.ErrorResponse
// @Router       /api/chatModels [get]
func (h *ChatHandler) ChatModels(w http.ResponseWriter, r *http.Request) {
	filtered, err := h.filterModelsByCapability("completion")
	if err != nil {
		log.Printf("Error listing models: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to list models", err)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"models": filtered,
	})
}

// EmbeddingModels godoc
// @Summary      List embedding-capable models
// @Description  Returns available Ollama models filtered to those with embedding capability
// @Tags         models
// @Produce      json
// @Success      200  {object}  map[string]interface{}
// @Failure      500  {object}  models.ErrorResponse
// @Router       /api/embedding [get]
func (h *ChatHandler) EmbeddingModels(w http.ResponseWriter, r *http.Request) {
	filtered, err := h.filterModelsByCapability("embedding")
	if err != nil {
		log.Printf("Error listing models: %v", err)
		respondWithError(w, http.StatusInternalServerError, "Failed to list models", err)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"models": filtered,
	})
}

func (h *ChatHandler) filterModelsByCapability(targetCapability string) ([]models.Model, error) {
	modelList, err := h.ollamaService.ListModels()
	if err != nil {
		return nil, err
	}

	var filtered []models.Model

	for _, m := range modelList {
		modelName := m.Name
		log.Printf("Checking model: %s", modelName)
		caps, err := h.ollamaService.ShowModel(modelName)
		if err != nil {
			log.Printf("Error getting capabilities for model %s: %v", modelName, err)
			continue
		}
		for _, c := range caps {
			if c == targetCapability {
				filtered = append(filtered, m)
				break
			}
		}
	}

	return filtered, nil
}

type ChatHandler struct {
	ollamaService *services.OllamaService
}

func NewChatHandler(ollamaService *services.OllamaService) *ChatHandler {
	return &ChatHandler{
		ollamaService: ollamaService,
	}
}

// Chat godoc
// @Summary      Send a chat message
// @Description  Sends messages to the Ollama service and returns the model's response
// @Tags         chat
// @Accept       json
// @Produce      json
// @Param        request  body      models.ChatRequest   true  "Chat request"
// @Success      200      {object}  models.ChatResponse
// @Failure      400      {object}  models.ErrorResponse
// @Failure      500      {object}  models.ErrorResponse
// @Router       /api/chat [post]
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

// ListModels godoc
// @Summary      List all models
// @Description  Returns all available Ollama models
// @Tags         models
// @Produce      json
// @Success      200  {object}  map[string]interface{}
// @Failure      500  {object}  models.ErrorResponse
// @Router       /api/tags [get]
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
