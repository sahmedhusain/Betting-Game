package middleware

import (
	"backend/internal/constants"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func SetupCORS() fiber.Handler {
	origins := os.Getenv(constants.EnvAllowedOrigins)
	if origins == "" {
		origins = constants.DefaultAllowedOrigins
	}

	return cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	})
}
