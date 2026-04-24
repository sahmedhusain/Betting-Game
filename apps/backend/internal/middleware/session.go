package middleware

import (
	"backend/internal/constants"
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

var sessionService = services.NewSessionService()

func SessionGuard(c *fiber.Ctx) error {
	sessionID := c.Cookies(constants.SessionCookieName)
	if sessionID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrNoSessionCookie})
	}

	session, err := sessionService.ValidateSession(sessionID)
	if err != nil || session == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrInvalidOrExpiredSession})
	}

	// Attach username to locals for downstream handlers
	c.Locals("username", session.Username)
	return c.Next()
}
