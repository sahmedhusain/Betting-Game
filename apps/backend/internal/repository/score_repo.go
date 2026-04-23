package repository

import (
	"backend/internal/config"
	"backend/internal/constants"
	"backend/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Fetch the top users from the database
func GetTopUsers(limit int64) ([]models.User, error) {
	collection := config.GetCollection(constants.UsersCollection)

	opts := options.Find().SetSort(bson.D{{Key: "highest_score", Value: -1}}).SetLimit(limit) // -1 is descending order

	cursor, err := collection.Find(context.Background(), bson.D{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var users []models.User
	if err := cursor.All(context.Background(), &users); err != nil { // Decode the cursor into the users slice
		return nil, err
	}

	return users, nil
}

// Update or insert the score to the user collection
func SaveScore(username string, newScore int, handsPlayed int) error {
	collection := config.GetCollection(constants.UsersCollection)
	now := time.Now()

	filter := bson.D{{Key: "username", Value: username}}

	update := bson.D{ // Update Data in MongoDB
		{Key: "$max", Value: bson.D{{Key: "highest_score", Value: newScore}}},
		{Key: "$inc", Value: bson.D{
			{Key: "total_score", Value: newScore},
			{Key: "total_games_played", Value: 1},
		}},
		{Key: "$set", Value: bson.D{{Key: "updated_at", Value: now}}},
		{Key: "$setOnInsert", Value: bson.D{{Key: "created_at", Value: now}}},
	}
	opts := options.Update().SetUpsert(true)
	_, err := collection.UpdateOne(context.Background(), filter, update, opts)
	return err

}
