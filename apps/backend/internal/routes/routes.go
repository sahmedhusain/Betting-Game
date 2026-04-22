package routes

import (
	"backend/internal/constants"
	"backend/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

// Configures the API routes
func SetupRoutes(app *fiber.App) {
	api := app.Group(constants.APIBasePath)

	api.Get(constants.ScoresPath, handlers.GetLeaderboard)
	api.Post(constants.ScoresPath, handlers.SaveScore)
	api.Post(constants.GamesPath, handlers.SaveGameSession)
	admin := api.Group(constants.AdminPath)
	admin.Post(constants.ResetPath, handlers.ResetDatabase)
}
