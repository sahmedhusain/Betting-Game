package handlers

import (
	"backend/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type ScoreInput struct {
	Username    string `json:"username"`
	Score       int    `json:"score"`
	HandsPlayed int    `json:"hands_played"`
}

func GetLeaderboard(c *fiber.Ctx) error {
	users, err := repository.GetTopUsers(5)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to fetch leaderboard",
		})
	}
	return c.Status(200).JSON(users) // Return as JSON
}

func SaveScore(c *fiber.Ctx) error { //localhost:<Port>/api/scores
	var input ScoreInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}
	if input.Username == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Username is required"})
	}
	err := repository.SaveScore(input.Username, input.Score, input.HandsPlayed)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save score"})
	}
	return c.Status(201).JSON(fiber.Map{"message": "Score saved successfully"})
}

