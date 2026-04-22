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
	session := models.GameSession{
		Username:    input.Username,
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
