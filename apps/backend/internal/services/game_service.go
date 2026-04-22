package service

import (
	"backend/internal/models"
	"backend/internal/repository"
)

type GameService struct{}

func NewGameService() *GameService {
	return &GameService{}
}

func (s *GameService) LogSession(session models.GameSession) error {
	return repository.SaveGameSession(session)
}
