package main

import (
	"backend/internal/config"
	"backend/internal/middleware"
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

	app := fiber.New(fiber.Config{
		AppName: "Mahjong Betting API v1",
	})

	// MIDDLEWARE
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(middleware.SetupRateLimiter())
	app.Use(middleware.SetupCORS())

	routes.SetupRoutes(app)

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "ok",
			"message": "API running",
		})
	})

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s\n", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Critical server failure: %v\n", err)
	}
}
