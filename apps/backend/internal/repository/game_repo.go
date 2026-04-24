package repository

import (
	"backend/internal/config"
	"backend/internal/constants"
	"backend/internal/models"
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// SaveGameSession logs
func SaveGameSession(session models.GameSession) error {
	collection := config.GetCollection(constants.GameSessionsCollection)
	_, err := collection.InsertOne(context.Background(), session)
	return err
}

func GetGameHistory(username string, limit int64) ([]models.GameSession, error) {
	collection := config.GetCollection(constants.GameSessionsCollection)

	opts := options.Find().SetSort(bson.D{{Key: constants.FieldEndedAt, Value: -1}}).SetLimit(limit)

	filter := bson.D{{Key: constants.FieldUsername, Value: username}}
	cursor, err := collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var sessions []models.GameSession
	if err := cursor.All(context.Background(), &sessions); err != nil {
		return nil, err
	}

	return sessions, nil
}
