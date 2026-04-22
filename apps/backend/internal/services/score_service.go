package service

import (
	"backend/internal/repository"
	"errors"
)

type ScoreService struct{}

func NewScoreService() *ScoreService {
	return &ScoreService{}
}

// handle validation and persistence
func (s *ScoreService) ProcessAndSave(username string, score int, handsPlayed int) error {
	if username == "" {
		return errors.New("username cannot be empty")
	}
	if score < 0 {
		return errors.New("score cannot be negative")
	}

	return repository.SaveScore(username, score, handsPlayed)
}
