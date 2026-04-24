package middleware

import (
	"backend/internal/config"
	"backend/internal/constants"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

// SetupRateLimiter protects API endpoints from burst abuse and accidental floods.
func SetupRateLimiter() fiber.Handler {
	maxRequests := config.GetEnvInt(constants.EnvRateLimitMax, constants.DefaultRateLimitMax)
	windowSeconds := config.GetEnvInt(constants.EnvRateLimitWindow, constants.DefaultRateLimitWindow)

	return limiter.New(limiter.Config{
		Max:        maxRequests,
		Expiration: time.Duration(windowSeconds) * time.Second,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		Next: func(c *fiber.Ctx) bool {
			path := c.Path()
			return path == constants.HealthPath ||
				path == constants.APIBasePath+constants.SessionStart ||
				path == constants.APIBasePath+constants.SessionValidate ||
				path == constants.APIBasePath+constants.SessionLogout ||
				path == constants.APIBasePath+constants.SessionState
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": constants.ErrRateLimitExceeded,
			})
		},
	})
}


