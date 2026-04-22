package repository

import (
	"backend/internal/config"
	"backend/internal/constants"
	"context"

	"go.mongodb.org/mongo-driver/bson"
)

type ResetResult struct {
	UsersDeleted       int64 `json:"users_deleted"`
	GameSessionsDeleted int64 `json:"game_sessions_deleted"`
}

func ResetApplicationData() (ResetResult, error) {
	ctx := context.Background()
	usersResult, err := config.GetCollection(constants.UsersCollection).DeleteMany(ctx, bson.D{})
	if err != nil {
		return ResetResult{}, err
	}

	gameSessionsResult, err := config.GetCollection(constants.GameSessionsCollection).DeleteMany(ctx, bson.D{})
	if err != nil {
		return ResetResult{}, err
	}

	return ResetResult{
		UsersDeleted:       usersResult.DeletedCount,
		GameSessionsDeleted: gameSessionsResult.DeletedCount,
	}, nil
}