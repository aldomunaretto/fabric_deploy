package main

import (
	"fmt"
	"gin-fabric-connector/api"
	"gin-fabric-connector/blockchain"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	client, err := blockchain.GetClient()
	if err != nil {
		fmt.Println("Error initializing fabric client:", err.Error())
		panic(err)
	}

	api.RegisterRoutes(r, *client)

	fmt.Println("Server running on :9595")
	r.Run(":9595")
}
