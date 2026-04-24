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
		Keys:    bson.D{{Key: constants.FieldExpiresAt, Value: 1}},
		Options: options.Index().SetExpireAfterSeconds(0),
	})
	if err != nil {
		log.Printf(constants.ErrTTLIndexFmt, constants.AuthSessionsCollection, err)
	}

	// Unique index on session_id
	_, err = collection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: constants.FieldSessionID, Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		log.Printf(constants.ErrUniqueIndexFmt, constants.FieldSessionID, err)
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
	err := collection.FindOne(context.Background(), bson.D{
		{Key: constants.FieldSessionID, Value: sessionID},
		{Key: "revoked_at", Value: nil},
	}).Decode(&session)

	if err != nil {
		return nil, err
	}
	return &session, nil
}

func RevokeSessionsByUsername(username string) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.DeleteMany(
		context.Background(),
		bson.D{{Key: constants.FieldUsername, Value: username}},
	)
	return err
}

func RevokeSessionByID(sessionID string) error {
	collection := config.GetCollection(constants.AuthSessionsCollection)
	_, err := collection.DeleteOne(
		context.Background(),
		bson.D{{Key: constants.FieldSessionID, Value: sessionID}},
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
	filter := bson.D{{Key: constants.FieldSessionID, Value: sessionID}}
	update := bson.D{{Key: "$set", Value: bson.D{
		{Key: constants.FieldGameState, Value: state},
		{Key: constants.FieldIsGameFinished, Value: isGameFinished},
		{Key: "last_seen_at", Value: time.Now()},
	}}}
	_, err := collection.UpdateOne(context.Background(), filter, update)
	return err
}
