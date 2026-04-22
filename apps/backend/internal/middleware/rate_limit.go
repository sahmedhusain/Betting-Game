package middleware

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

// SetupRateLimiter protects API endpoints from burst abuse and accidental floods.
func SetupRateLimiter() fiber.Handler {
	maxRequests := getEnvInt("RATE_LIMIT_MAX", 120)
	windowSeconds := getEnvInt("RATE_LIMIT_WINDOW_SECONDS", 60)

	return limiter.New(limiter.Config{
		Max:        maxRequests,
		Expiration: time.Duration(windowSeconds) * time.Second,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		Next: func(c *fiber.Ctx) bool {
			return c.Path() == "/api/health"
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "Rate limit exceeded. Please try again shortly.",
			})
		},
	})
}

func getEnvInt(key string, fallback int) int {
	raw := os.Getenv(key)
	if raw == "" {
		return fallback
	}

	value, err := strconv.Atoi(raw)
	if err != nil || value <= 0 {
		log.Printf("Invalid %s=%q, using default %d", key, raw, fallback)
		return fallback
	}

	return value
}
