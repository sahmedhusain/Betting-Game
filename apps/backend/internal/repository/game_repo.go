package repository

import (
	"backend/internal/config"
	"backend/internal/models"
	"context"
)

// SaveGameSession logs
func SaveGameSession(session models.GameSession) error {
	collection := config.GetCollection("game_sessions")
	_, err := collection.InsertOne(context.Background(), session)
	return err
}
