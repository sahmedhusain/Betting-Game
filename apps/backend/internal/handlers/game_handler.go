package handlers

import (
	"backend/internal/constants"
	"backend/internal/models"
	"backend/internal/services"
	"time"

	"github.com/gofiber/fiber/v2"
)

var gameService = services.NewGameService()

func SaveGameSession(c *fiber.Ctx) error {
	var input ScoreInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": constants.ErrInvalidRequestBody})
	}

	username, ok := c.Locals("username").(string)
	if !ok || username == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized: Identity missing"})
	}

	session := models.GameSession{
		Username:    username,
		FinalScore:  input.Score,
		HandsPlayed: input.HandsPlayed,
		EndedAt:     time.Now(),
	}

	if err := gameService.PrepareSession(&session); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err := gameService.LogSession(session)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": constants.ErrFailedSaveGameSession})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": constants.MsgGameSessionLogged})
}
