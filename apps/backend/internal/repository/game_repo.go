package repository

import (
	"backend/internal/config"
	"backend/internal/constants"
	"backend/internal/models"
	"context"
)

// SaveGameSession logs
func SaveGameSession(session models.GameSession) error {
	collection := config.GetCollection(constants.GameSessionsCollection)
	_, err := collection.InsertOne(context.Background(), session)
	return err
}
