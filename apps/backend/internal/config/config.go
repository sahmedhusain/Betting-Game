package config

import (
	"backend/internal/constants"
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
	if os.Getenv(constants.EnvMongodbURI) != "" {
		return
	}

	wd, err := os.Getwd()
	if err != nil {
		log.Printf(constants.ErrWorkingDirFmt, err)
		return
	}

	envPath, err := findEnvFile(wd)
	if err != nil {
		log.Println(constants.MsgEnvFileNotFound)
		return
	}

	if err := godotenv.Load(envPath); err != nil {
		log.Printf(constants.ErrEnvLoadFmt, envPath, err)
		return
	}

	log.Printf(constants.MsgEnvLoadedFmt, envPath)
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

	mongoURI := os.Getenv(constants.EnvMongodbURI)
	if mongoURI == "" {
		log.Fatal(constants.ErrInvalidMongoURI)
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	ctx, cancel := context.WithTimeout(context.Background(), constants.MongoConnectionTimeout*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("%s: %v", constants.ErrFailedConnectMongo, err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("%s: %v", constants.ErrFailedPingMongo, err)
	}

	DB = client
	log.Println(constants.MsgConnectedToMongo)

}

func GetCollection(collectionName string) *mongo.Collection {
	return DB.Database(constants.DefaultDatabaseName).Collection(collectionName)
}
