package services

import (
	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/validation"
	"time"

	"github.com/google/uuid"
)

type SessionService struct{}

func NewSessionService() *SessionService {
	return &SessionService{}
}

func (s *SessionService) StartSession(username string) (*models.AuthSession, error) {
	username = validation.NormalizePlayerName(username)
	if err := validation.ValidatePlayerName(username); err != nil {
		return nil, err
	}

	// Invalidate older sessions for the same username
	if err := repository.RevokeSessionsByUsername(username); err != nil {
		return nil, err
	}

	sessionID := uuid.New().String()
	now := time.Now()
	session := models.AuthSession{
		SessionID:  sessionID,
		Username:   username,
		CreatedAt:  now,
		ExpiresAt:  now.Add(config.SessionTTL),
		LastSeenAt: now,
	}

	if err := repository.CreateSession(session); err != nil {
		return nil, err
	}

	return &session, nil
}

func (s *SessionService) ValidateSession(sessionID string) (*models.AuthSession, error) {
	session, err := repository.GetSessionByID(sessionID)
	if err != nil {
		return nil, err
	}

	if session.ExpiresAt.Before(time.Now()) {
		_ = repository.RevokeSessionByID(sessionID)
		return nil, nil // Session expired
	}

	// Update last seen
	_ = repository.UpdateSessionLastSeen(sessionID)

	return session, nil
}

func (s *SessionService) TerminateSession(sessionID string) error {
	return repository.RevokeSessionByID(sessionID)
}

func (s *SessionService) UpdateGameState(sessionID string, state models.GameState, isGameFinished bool) error {
	return repository.UpdateGameState(sessionID, state, isGameFinished)
}
