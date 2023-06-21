package main

import (
	"encoding/json"
	"fmt"
	"sync"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/infra/kafka"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/market/dto"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/market/entity"
	"github.com/stardusteight-d4c/fclx-home-broker/trade/internal/market/transformer"
)

func main() {
	ordersIn := make(chan *entity.Order)
	ordersOut := make(chan *entity.Order)
	wg := &sync.WaitGroup{}
	defer wg.Wait()

	kafkaMsgChan := make(chan *ckafka.Message)
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": "host.docker.internal:9094",
		"group.id":          "myGroup",
		"auto.offset.reset": "latest",
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

// kafka messages (input topic)

// {
//   "order_id": "1",
//   "investor_id": "Celia",
//   "asset_id": "asset1",
//   "current_shares": 0,
//   "shares": 5,
//   "price": 5.0,
//   "order_type": "BUY"
// }

// {
//   "order_id": "1",
//   "investor_id": "Mari",
//   "asset_id": "asset1",
//   "current_shares": 10,
//   "shares": 5,
//   "price": 5.0,
//   "order_type": "SELL"
// }

// sales order transaction
// transaction performed:  {
//   "order_id": "1",
//   "investor_id": "Mari",
//   "asset_id": "asset1",
//   "order_type": "SELL",
//   "status": "CLOSED",
//   "partial": 0,
//   "shares": 5,
//   "transactions": [
//     {
//       "transaction_id": "6fe28de3-8069-41a1-b62a-616b6aa766c3",
//       "buyer_id": "1",
//       "seller_id": "1",
//       "asset_id": "asset1",
//       "price": 5,
//       "shares": 5
//     }
//   ]
// }

// purchase order transaction
// transaction performed:  {
//   "order_id": "1",
//   "investor_id": "Celia",
//   "asset_id": "asset1",
//   "order_type": "BUY",
//   "status": "CLOSED",
//   "partial": 0,
//   "shares": 5,
//   "transactions": [
//     {
//       "transaction_id": "6fe28de3-8069-41a1-b62a-616b6aa766c3",
//       "buyer_id": "1",
//       "seller_id": "1",
//       "asset_id": "asset1",
//       "price": 5,
//       "shares": 5
//     }
//   ]
// }
