package handlers

import (
	"backend/internal/constants"
	"backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

var adminService = services.NewAdminService()

type AdminResetInput struct {
	Username string `json:"admin_username"`
	Token    string `json:"admin_token"`
}

func ResetDatabase(c *fiber.Ctx) error {
	if !c.Is("json") {
		return c.Status(fiber.StatusUnsupportedMediaType).JSON(fiber.Map{"error": constants.ErrJSONContentTypeRequired})
	}

	var input AdminResetInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": constants.ErrInvalidRequestBody})
	}

	if input.Username == "" || input.Token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrAdminAuthRequired})
	}

	if !adminService.ValidateResetCredentials(input.Username, input.Token) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": constants.ErrAdminAuthInvalid})
	}

	result, err := adminService.ResetDatabase()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": constants.MsgResetDatabaseFailed})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": constants.MsgDatabaseReset,
		"data":    result,
	})
}