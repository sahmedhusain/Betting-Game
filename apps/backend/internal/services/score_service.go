package services

import (
	"backend/internal/repository"
	"backend/internal/validation"
	"errors"
)

type ScoreService struct{}

func NewScoreService() *ScoreService {
	return &ScoreService{}
}

// handle validation and persistence
func (s *ScoreService) ProcessAndSave(username string, score int, handsPlayed int) error {
	username = validation.NormalizePlayerName(username)
	if err := validation.ValidatePlayerName(username); err != nil {
		return err
	}

	if score < 0 {
		return errors.New("score cannot be negative")
	}

	if handsPlayed < 0 {
		return errors.New("hands_played cannot be negative")
	}

	return repository.SaveScore(username, score, handsPlayed)
}
