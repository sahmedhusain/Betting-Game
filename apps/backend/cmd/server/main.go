package main

import (
	"backend/internal/config"
	"backend/internal/constants"
	"backend/internal/middleware"
	"backend/internal/repository"
	"backend/internal/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()
	repository.InitSessionIndices()

	app := fiber.New(fiber.Config{
		AppName: constants.AppName,
	})

	// MIDDLEWARE
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(middleware.SetupRateLimiter())
	app.Use(middleware.SetupCORS())

	routes.SetupRoutes(app)

	app.Get(constants.HealthPath, func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "ok",
			"message": constants.MsgAPIRunning,
		})
	})

	port := os.Getenv(constants.EnvBackendPort)
	if port == "" {
		port = constants.DefaultBackendPort
	}

	log.Printf(constants.MsgServerStartingPortFmt, port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Critical server failure: %v\n", err)
	}
}
