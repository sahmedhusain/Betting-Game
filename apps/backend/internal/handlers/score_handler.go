package handlers

import (
	"backend/internal/repository"
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

const (
	defaultLeaderboardLimit = int64(5)
	maxLeaderboardLimit     = int64(20)
)

var scoreService = services.NewScoreService()

type ScoreInput struct {
	Username    string `json:"player_name"`
	Score       int    `json:"score"`
	HandsPlayed int    `json:"hands_played"`
}

type LeaderboardEntry struct {
	PlayerName string `json:"player_name"`
	Score      int    `json:"score"`
}

func GetLeaderboard(c *fiber.Ctx) error {
	limit := int64(c.QueryInt("limit", int(defaultLeaderboardLimit)))
	if limit <= 0 {
		limit = defaultLeaderboardLimit
	}
	if limit > maxLeaderboardLimit {
		limit = maxLeaderboardLimit
	}

	users, err := repository.GetTopUsers(limit)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch leaderboard"})
	}

	entries := make([]LeaderboardEntry, 0, len(users))
	for _, user := range users {
		entries = append(entries, LeaderboardEntry{
			PlayerName: user.Username,
			Score:      user.HighestScore,
		})
	}

	return c.Status(200).JSON(entries)
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
