package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GameState struct {
	Score          int           `json:"score" bson:"score"`
	CurrentHand    []interface{} `json:"current_hand" bson:"current_hand"`
	History        []interface{} `json:"history" bson:"history"`
	DeckState      interface{}   `json:"deck_state" bson:"deck_state"`
	ReshuffleCount int           `json:"reshuffle_count" bson:"reshuffle_count"`
	GamePhase      string        `json:"game_phase" bson:"game_phase"`
}

type AuthSession struct {
	ID         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	SessionID  string             `json:"session_id" bson:"session_id"`
	Username   string             `json:"username" bson:"username"`
	CreatedAt  time.Time          `json:"created_at" bson:"created_at"`
	ExpiresAt  time.Time          `json:"expires_at" bson:"expires_at"`
	RevokedAt  *time.Time         `json:"revoked_at,omitempty" bson:"revoked_at,omitempty"`
	LastSeenAt     time.Time          `json:"last_seen_at" bson:"last_seen_at"`
	GameState      *GameState         `json:"game_state,omitempty" bson:"game_state,omitempty"`
	IsGameFinished bool               `json:"is_game_finished" bson:"is_game_finished"`
}
