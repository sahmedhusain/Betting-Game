package repository

import (
	"backend/internal/config"
	"backend/internal/constants"
	"backend/internal/models"
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitSessionIndices() {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// TTL index on expires_at
	_, err := collection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "expires_at", Value: 1}},
		Options: options.Index().SetExpireAfterSeconds(0),
	})
	if err != nil {
		log.Printf("Error creating TTL index on auth_sessions: %v", err)
	}

	// Unique index on session_id
	_, err = collection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "session_id", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Printf("Error creating unique index on session_id: %v", err)
	}
}

func CreateSession(session models.AuthSession) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.InsertOne(context.Background(), session)
	return err
}

func GetSessionByID(sessionID string) (*models.AuthSession, error) {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	var session models.AuthSession
	err := collection.FindOne(context.Background(), bson.M{
		"session_id": sessionID,
		"revoked_at": nil,
	}).Decode(&session)

	if err != nil {
		return nil, err
	}
	return &session, nil
}

func RevokeSessionsByUsername(username string) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.UpdateMany(
		context.Background(),
		bson.M{"username": username, "revoked_at": nil},
		bson.M{"$set": bson.M{"revoked_at": time.Now()}},
	)
	return err
}

func RevokeSessionByID(sessionID string) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.UpdateOne(
		context.Background(),
		bson.M{"session_id": sessionID},
		bson.M{"$set": bson.M{"revoked_at": time.Now()}},
	)
	return err
}

func UpdateSessionLastSeen(sessionID string) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.UpdateOne(
		context.Background(),
		bson.M{"session_id": sessionID},
		bson.M{"$set": bson.M{"last_seen_at": time.Now()}},
	)
	return err
}

func UpdateGameState(sessionID string, state models.GameState, isGameFinished bool) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.UpdateOne(
		context.Background(),
		bson.M{"session_id": sessionID},
		bson.M{"$set": bson.M{
			"game_state":       state,
			"is_game_finished": isGameFinished,
			"last_seen_at":     time.Now(),
		}},
	)
	return err
}
