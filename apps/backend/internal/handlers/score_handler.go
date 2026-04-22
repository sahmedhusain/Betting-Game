package handlers

import (
	"backend/internal/repository"
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

var scoreService = service.NewScoreService()

type ScoreInput struct {
	Username    string `json:"player_name"`
	Score       int    `json:"score"`
	HandsPlayed int    `json:"hands_played"`
}

func GetLeaderboard(c *fiber.Ctx) error {
	users, err := repository.GetTopUsers(5)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch leaderboard"})
	}
	return c.Status(200).JSON(users)
}

func SaveScore(c *fiber.Ctx) error {
	var input ScoreInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}
	err := scoreService.ProcessAndSave(input.Username, input.Score, input.HandsPlayed)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Legend recorded successfully"})
}
