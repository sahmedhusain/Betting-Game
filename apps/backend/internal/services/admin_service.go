package services

import (
	"backend/internal/constants"
	"backend/internal/repository"
	"os"
)

type AdminService struct{}

func NewAdminService() *AdminService {
	return &AdminService{}
}

func (s *AdminService) ValidateResetCredentials(username, token string) bool {
	return username == os.Getenv(constants.EnvAdminResetUsername) && token == os.Getenv(constants.EnvAdminResetToken)
}

func (s *AdminService) ResetDatabase() (repository.ResetResult, error) {
	return repository.ResetApplicationData()
}