package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// SetupCORS initializes the cross-origin resource sharing policy
func SetupCORS() fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins: "*", // We can restrict this via ENV later
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	})
}
