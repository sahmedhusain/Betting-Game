package validation

import (
	"backend/internal/constants"
	"errors"
	"fmt"
	"regexp"
	"strings"
	"unicode/utf8"
)

var playerNameRegex = regexp.MustCompile(`^[A-Za-z0-9._-]+$`)

func NormalizePlayerName(name string) string {
	return strings.TrimSpace(name)
}

func ValidatePlayerName(name string) error {
	if name == "" {
		return errors.New(constants.ErrPlayerNameRequired)
	}

	if utf8.RuneCountInString(name) > constants.MaxPlayerNameLength {
		return fmt.Errorf("player_name must be at most %d characters", constants.MaxPlayerNameLength)
	}

	if !playerNameRegex.MatchString(name) {
		return errors.New(constants.ErrPlayerNameCharset)
	}

	return nil
}
