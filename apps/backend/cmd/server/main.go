package main

import (
	"backend/internal/config"
	"backend/internal/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {

	config.LoadEnv()
	config.ConnectDB()

	app := fiber.New() //Start fiber server

	app.Use(logger.New())
	routes.SetupRoutes(app) //Routes setup

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "ok",
			"message": "Game API running", // localhost:8080/api/health
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Fallback
	}

	log.Println("Server started as localhost on port " + port)
	err := app.Listen(":" + port) // listening port 8080
	if err != nil {
		log.Fatalf("Server failed to start: %v\n", err)
	}
}
