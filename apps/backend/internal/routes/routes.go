package routes

import (
	"backend/internal/handlers"
	"github.com/gofiber/fiber/v2"
)

// Configures the API routes
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/scores", handlers.GetLeaderboard)
	api.Post("/scores", handlers.SaveScore)
	api.Post("/games", handlers.SaveGameSession)
}
