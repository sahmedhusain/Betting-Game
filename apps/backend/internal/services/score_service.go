package services

import (
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/validation"
	"errors"
	"time"
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

	// Save to user aggregate
	if err := repository.SaveScore(username, score, handsPlayed); err != nil {
		return err
	}

	// Log individual game session for history/scalability
	session := models.GameSession{
		Username:    username,
		FinalScore:  score,
		HandsPlayed: handsPlayed,
		EndedAt:     time.Now(),
	}

	return repository.SaveGameSession(session)
}
