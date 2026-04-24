package routes

import (
	"backend/internal/constants"
	"backend/internal/handlers"
	"backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// Configures the API routes
func SetupRoutes(app *fiber.App) {
	api := app.Group(constants.APIBasePath)

	api.Get(constants.ScoresPath, handlers.GetLeaderboard)

	// Session endpoints
	api.Post(constants.SessionStart, handlers.StartSession)
	api.Get(constants.SessionValidate, handlers.ValidateSession)
	api.Post(constants.SessionLogout, handlers.LogoutSession)
	api.Put(constants.SessionState, handlers.SaveGameState)

	// Protected gameplay endpoints
	api.Post(constants.ScoresPath, middleware.SessionGuard, handlers.SaveScore)
	api.Post(constants.GamesPath, middleware.SessionGuard, handlers.SaveGameSession)
	api.Get(constants.GamesPath, middleware.SessionGuard, handlers.GetGameHistory)

	admin := api.Group(constants.AdminPath)
	admin.Post(constants.ResetPath, handlers.ResetDatabase)
}
