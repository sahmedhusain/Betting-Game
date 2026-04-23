package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username         string             `json:"username" bson:"username"`
	HighestScore     int                `json:"highest_score" bson:"highest_score"`
	TotalScore       int                `json:"total_score" bson:"total_score"`
	TotalGamesPlayed int                `json:"total_games_played" bson:"total_games_played"`
	CreatedAt        time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt        time.Time          `json:"updated_at" bson:"updated_at"`
}
