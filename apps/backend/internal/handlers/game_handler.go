package handlers

import (
	"backend/internal/models"
	"backend/internal/repository"
	"time"

	"github.com/gofiber/fiber/v2"
)

func SaveGameSession(c *fiber.Ctx) error {
	var input ScoreInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}
	session := models.GameSession{
		Username:    input.Username,
		FinalScore:  input.Score,
		HandsPlayed: input.HandsPlayed,
		EndedAt:     time.Now(),
	}
	err := repository.SaveGameSession(session)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save game session"})
	}
	return c.Status(201).JSON(fiber.Map{"message": "Game session logged successfully"})
}
