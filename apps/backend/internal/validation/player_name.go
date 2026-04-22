package validation

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
	"unicode/utf8"
)

const MaxPlayerNameLength = 16

var playerNameRegex = regexp.MustCompile(`^[A-Za-z0-9._-]+$`)

func NormalizePlayerName(name string) string {
	return strings.TrimSpace(name)
}

func ValidatePlayerName(name string) error {
	if name == "" {
		return errors.New("player_name is required")
	}

	if utf8.RuneCountInString(name) > MaxPlayerNameLength {
		return fmt.Errorf("player_name must be at most %d characters", MaxPlayerNameLength)
	}

	if !playerNameRegex.MatchString(name) {
		return errors.New("player_name may contain only letters, numbers, dot (.), underscore (_), and hyphen (-)")
	}

	return nil
}
