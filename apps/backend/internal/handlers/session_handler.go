package handlers

import (
	"backend/internal/constants"
	"backend/internal/models"
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

var sessionService = services.NewSessionService()

type SessionStartInput struct {
	Username string `json:"username"`
}

func StartSession(c *fiber.Ctx) error {
	var input SessionStartInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": constants.ErrInvalidRequestBody})
	}

	session, err := sessionService.StartSession(input.Username)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	c.Cookie(&fiber.Cookie{
		Name:     constants.SessionCookieName,
		Value:    session.SessionID,
		Expires:  session.ExpiresAt,
		HTTPOnly: true,
		Secure:   false, // Set to true if using HTTPS
		SameSite: "Lax",
		Path:     "/",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"username": session.Username,
		"expires":  session.ExpiresAt,
	})
}

func ValidateSession(c *fiber.Ctx) error {
	sessionID := c.Cookies(constants.SessionCookieName)
	if sessionID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrNoSessionCookie})
	}

	session, err := sessionService.ValidateSession(sessionID)
	if err != nil || session == nil {
		c.ClearCookie(constants.SessionCookieName)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrInvalidOrExpiredSession})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"username":         session.Username,
		"expires":          session.ExpiresAt,
		"game_state":       session.GameState,
		"is_game_finished": session.IsGameFinished,
	})
}

func SaveGameState(c *fiber.Ctx) error {
	sessionID := c.Cookies(constants.SessionCookieName)
	if sessionID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrUnauthorized})
	}

	var input struct {
		State          models.GameState `json:"state"`
		IsGameFinished bool             `json:"is_game_finished"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": constants.ErrInvalidRequestBody})
	}

	if err := sessionService.UpdateGameState(sessionID, input.State, input.IsGameFinished); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": constants.ErrFailedSaveState})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": constants.MsgStateSaved})
}

func LogoutSession(c *fiber.Ctx) error {
	sessionID := c.Cookies(constants.SessionCookieName)
	if sessionID != "" {
		_ = sessionService.TerminateSession(sessionID)
	}

	c.ClearCookie(constants.SessionCookieName)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": constants.MsgLoggedOut})
}
