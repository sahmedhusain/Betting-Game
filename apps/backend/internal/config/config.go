package config

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client

// Load environment variables from .env file
func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}
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
		log.Fatal("Failed to connect to MongoDB: %v\n", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Failed to ping MongoDB: %v\n", err)
	}

	DB = client // Assign the connected client to the global DB variable
	log.Println("Connected to MongoDB")

}

func getCollection(collectionName string) *mongo.Collection {
	return DB.Database("betting_game").Collection(collectionName)
}
