package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/infra/kafka"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/market/dto"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/market/entity"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/market/transformer"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("error loading .env file")
	}

	upstashKafkaUsername := os.Getenv("UPSTASH_KAFKA_USERNAME")
	upstashKafkaPassword := os.Getenv("UPSTASH_KAFKA_PASSWORD")

	ordersIn := make(chan *entity.Order)
	ordersOut := make(chan *entity.Order)
	wg := &sync.WaitGroup{}
	defer wg.Wait()
	kafkaMsgChan := make(chan *ckafka.Message)

	configMap := &ckafka.ConfigMap{
		// network docker gateway ip + port 172.18.0.1:9092 || upstash endpoint
		"bootstrap.servers":   "improved-lemur-14028-us1-kafka.upstash.io:9092",
		"group.id":            "myGroup",
		"auto.offset.reset":   "latest",
		"sasl.username":       upstashKafkaUsername,
		"sasl.password":       upstashKafkaPassword,
		"security.protocol":   "sasl_ssl",
		"sasl.mechanisms":     "SCRAM-SHA-256",
		"ssl.ca.location":     "/etc/ssl/certs",
		"api.version.request": true,
	}

	producer := kafka.NewKafkaProducer(configMap)
	kafka := kafka.NewConsumer(configMap, []string{"input"})

	// kafka msg channel
	go kafka.Consume(kafkaMsgChan) // thread 2

	// receive from kafka channel, send to input, process send to output, then publish to kafka
	book := entity.NewBook(ordersIn, ordersOut, wg)
	go book.Trade() // thread 3

	go func() {
		for msg := range kafkaMsgChan {
			wg.Add(1)
			fmt.Println("mensagem recebida: ", string(msg.Value))
			tradeInput := dto.TradeInput{}
			// json.Unmarshal -> transform from json to object
			// get the message received from kafka and throw it into tradeInput
			err := json.Unmarshal(msg.Value, &tradeInput)
			if err != nil {
				panic(err)
			}
			// creating order
			order := transformer.TransformInput(tradeInput)
			// throwing the order data into the orders channel (which is being read by Book in the Trade method)
			ordersIn <- order
		}
	}()

	for res := range ordersOut {
		// transforming into an object of type*dto.OrderOutput
		output := transformer.TransformOutput(res)
		// transforming into json
		outputJson, err := json.MarshalIndent(output, "", "  ")
		fmt.Println("transaction performed: ", string(outputJson))
		if err != nil {
			fmt.Println(err)
		}
		// publishing in kafka
		producer.Publish(outputJson, []byte("orders"), "output")
	}
}
