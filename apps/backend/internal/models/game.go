package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GameSession struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Username    string             `json:"username" bson:"username"`
	FinalScore  int                `json:"final_score" bson:"final_score"`
	HandsPlayed int                `json:"hands_played" bson:"hands_played"`
	EndedAt     time.Time          `json:"ended_at" bson:"ended_at"`
}
