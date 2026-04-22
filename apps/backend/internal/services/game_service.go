package services

import (
	"backend/internal/constants"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/validation"
	"errors"
)

type GameService struct{}

func NewGameService() *GameService {
	return &GameService{}
}

func (s *GameService) PrepareSession(session *models.GameSession) error {
	session.Username = validation.NormalizePlayerName(session.Username)
	if err := validation.ValidatePlayerName(session.Username); err != nil {
		return err
	}

	if session.FinalScore < 0 {
		return errors.New(constants.ErrScoreCannotBeNegative)
	}

	if session.HandsPlayed < 0 {
		return errors.New(constants.ErrHandsPlayedCannotBeNegative)
	}

	return nil
}

func (s *GameService) LogSession(session models.GameSession) error {
	return repository.SaveGameSession(session)
}
