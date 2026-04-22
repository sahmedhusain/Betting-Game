package config

import (
	"context"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client

// Load environment variables from .env file
func LoadEnv() {
	if os.Getenv("MONGODB_URI") != "" {
		return
	}

	wd, err := os.Getwd()
	if err != nil {
		log.Printf("Warning: unable to determine working directory: %v", err)
		return
	}

	envPath, err := findEnvFile(wd)
	if err != nil {
		log.Println("Warning: .env file not found; relying on environment variables")
		return
	}

	if err := godotenv.Load(envPath); err != nil {
		log.Printf("Warning: failed to load .env from %s: %v", envPath, err)
		return
	}

	log.Printf("Loaded environment from %s", envPath)
}

func findEnvFile(startDir string) (string, error) {
	dir := startDir
	for {
		candidate := filepath.Join(dir, ".env")
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			return candidate, nil
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}

	return "", os.ErrNotExist
}

func ConnectDB() {

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("MONGODB_URI is not set in .env file")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // 10 seconds timeout for MongoDB connection
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	DB = client // Assign the connected client to the global DB variable
	log.Println("Connected to MongoDB")

}

func GetCollection(collectionName string) *mongo.Collection {
	return DB.Database("betting_game").Collection(collectionName)
}
