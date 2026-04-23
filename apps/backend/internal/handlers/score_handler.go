package handlers

import (
	"backend/internal/constants"
	"backend/internal/repository"
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

var scoreService = services.NewScoreService()

type ScoreInput struct {
	Username    string `json:"player_name"`
	Score       int    `json:"score"`
	HandsPlayed int    `json:"hands_played"`
}

type LeaderboardEntry struct {
	PlayerName   string `json:"player_name"`
	Score        int    `json:"score"`
	HighestScore int    `json:"highest_score"`
}

func GetLeaderboard(c *fiber.Ctx) error {
	limit := int64(c.QueryInt("limit", int(constants.DefaultLeaderboardLimit)))
	if limit <= 0 {
		limit = constants.DefaultLeaderboardLimit
	}
	if limit > constants.MaxLeaderboardLimit {
		limit = constants.MaxLeaderboardLimit
	}

	users, err := repository.GetTopUsers(limit)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": constants.ErrFailedFetchLeaderboard})
	}

	entries := make([]LeaderboardEntry, 0, len(users))
	for _, user := range users {
		entries = append(entries, LeaderboardEntry{
			PlayerName:   user.Username,
			Score:        user.HighestScore,
			HighestScore: user.HighestScore,
		})
	}

	return c.Status(fiber.StatusOK).JSON(entries)
}

func SaveScore(c *fiber.Ctx) error {
	var input ScoreInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": constants.ErrInvalidRequestBody})
	}

	username, ok := c.Locals("username").(string)
	if !ok || username == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized: Identity missing"})
	}

	err := scoreService.ProcessAndSave(username, input.Score, input.HandsPlayed)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": constants.MsgLegendRecorded})
}
