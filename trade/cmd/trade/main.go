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

	// recebe do canal do kafka, joga no input, processa joga no output e depois publica no kafka
	book := entity.NewBook(ordersIn, ordersOut, wg)
	go book.Trade() // thread 3

	go func() {
		for msg := range kafkaMsgChan {
			wg.Add(1)
			fmt.Println("mensagem recebida: ", string(msg.Value))
			tradeInput := dto.TradeInput{}
			// json.Unmarshal -> transformar de json para meu objeto
			// pega a messagem recebida do kafka e joga em tradeInput
			err := json.Unmarshal(msg.Value, &tradeInput)
			if err != nil {
				panic(err)
			}
			// criando order
			order := transformer.TransformInput(tradeInput)
			// jogando os dados de order no canal ordersIn (que está sendo lido por Book no método Trade)
			ordersIn <- order
		}
	}()

	for res := range ordersOut {
		// transformando em obj do tipo  *dto.OrderOutput
		output := transformer.TransformOutput(res)
		// tranformando em json
		outputJson, err := json.MarshalIndent(output, "", "  ")
		fmt.Println("transação realizada: ", string(outputJson))
		if err != nil {
			fmt.Println(err)
		}
		// publicando no kafka
		producer.Publish(outputJson, []byte("orders"), "output")
	}
}

// Kafka messages (input topic)

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

// transação de ordem de venda
// transação realizada:  {
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

// transação de ordem de compra
// transação realizada:  {
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
