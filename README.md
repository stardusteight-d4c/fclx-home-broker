<div align="center">
  <img src="logo.png" width="222" height="78" />
</div>

<h1 align="center">
 Full Cycle Learning Experience, Home Broker and Trade Service
</h1>

A Homebroker is an asset trading platform that allows users to buy and sell stocks, bonds and other financial instruments quickly and conveniently. The application is built using modern technologies and follows an event-driven architecture.

SWR is used to efficiently fetch and cache data, improving application performance. In addition, Lightweight Charts was used to display financial charts in real time. Using Server-sent events allows users to receive real-time updates from the server, keeping them always informed of the latest asset changes.

On the backend, we use a combination of technologies. Golang (Go) was used to build high performance critical components. Node.js is used as the JavaScript runtime platform to create the server infrastructure and handle the business logic, while the service in Go is responsible for the logic and calculations of the transactions that will be received via messaging (Kafka), and so it performs the transactions and sends the data back to Kafka so that both applications have their data synchronized, and so we maintain communication between the systems where both are reading and publishing messages on specific topics, and then the API server in NestJS , sends the updates through Server-sent events to the web client.

MongoDB was used as NoSQL database to store and retrieve data related to assets and transactions. Apache Kafka is used as a messaging service/bus for asynchronous and distributed messaging, allowing event processing and communication between application components.

The Homebroker application provides an efficient, real-time trading experience for users. They can conveniently carry out purchase and sale transactions of financial assets and receive real-time updates on the market. The event-driven architecture allows loose coupling between components and enables application scalability to handle large volumes of data.

In summary, Homebroker is a modern asset trading application that combines powerful frontend and backend, following an event-driven approach to provide users with an efficient and real-time trading experience.

*Ps.: This repository is just a demonstration of which technologies can be involved in more complex business rules and more critical applications.*

## :hammer_and_wrench: Tools

### Frontend

* React
* Next.js
* TypeScript
* SWR (stale-while-revalidate)
* TailwindCSS
* Server-sent events
* Lightweight Charts (lightweight-charts library)

### Backend

* TypeScript
* Golang (Go)
* Node.js
* NestJS
* MongoDB (NoSQL Database)
* Server-sent events
* Docker/Docker Compose
* Apache Kafka (messaging service/bus)
* Event-driven Architecture

## :mailbox_with_mail: Utilities
 
### Apache Kafka
 
Apache Kafka is an open source, distributed streaming platform designed to handle continuous streams of real-time data. It provides a scalable, high-performance architecture for handling large volumes of data and offers advanced capabilities for processing and analyzing data streams.

The main purpose of Apache Kafka is to provide a platform for transmitting real-time events and data between systems and applications. It acts as a reliable and durable intermediary for event processing, allowing different components of a system to communicate in an asynchronous and distributed manner.

Kafka is designed around a few key concepts:

1. **Producers**: These are the entities that send messages or events to Kafka. Producers publish messages under specific topics, which are logical categories of events.

2. **Consumers**: These are the entities that receive messages or events from Kafka. Consumers subscribe to topics and can process messages in real time.

3. **Topics**: These are the logical categories of events or messages. Producers post messages to threads and consumers subscribe to threads to receive messages.

4. **Partitions**: Topics are divided into partitions, which are units of scalability and fault tolerance. Partitions allow Kafka to distribute and parallelize event processing.

5. **Clusters**: Kafka runs on a distributed cluster composed of several servers called "brokers". Each broker is responsible for storing and managing a set of partitions.

Apache Kafka offers features such as persistence of data to disk, data replication for fault tolerance, horizontal scaling to handle large volumes of data, and support for real-time data streams.

Due to its scalability, durability and ability to process large streams of data in real time, Apache Kafka is widely used in data streaming scenarios such as real-time event processing, systems integration, real-time data analysis, data pipelines, real-time data ingestion, and more.

### Server-sent events

Clear! Server-sent events is a technology that allows the server to send asynchronous updates to the client over a long-running HTTP connection. It is a form of one-way communication, in which the server sends events to the client without the client having to make an explicit request.

Here are the main concepts related to Server-sent events:

1. **Client**: It is the browser or the application that connects to the server to receive the sent events.

2. **Server**: It is the side that sends the events to the client. The server needs to support Server-sent events functionality and provide a specific endpoint for clients to connect to.

3. **EventSource**: It is a JavaScript API that allows the client to connect to the server to receive events. The client creates an instance of EventSource and provides the URL of the event endpoint on the server to establish the connection.

4. **Events**: These are messages sent by the server to the client. Each event is a data structure that contains an event name and associated data. The server can send events periodically or in response to specific events that occur on the server side.

5. **Auto Reconnect**: The connection between the client and the server is kept alive automatically. If the connection is interrupted for any reason, the client will automatically attempt to reconnect to the server.

Server-sent events are useful in scenarios where you need to keep clients updated with real-time information. Some of the practical applications include:

- Real-time updates: The server can send instant updates to the client when important events occur, such as data updates, notifications or processing status.

- Continuous data streams: Server-sent events are suitable for sending continuous streams of data to the client, such as news feeds, sensor data or financial transaction updates.

- Remote monitoring: You can use Server-sent events to remotely monitor the state of a system or device and receive real-time alerts when critical events occur.

Server-sent events are an alternative to using other technologies such as WebSockets, which allow bidirectional communication between client and server. However, they are best suited for use cases where server-to-client communication is prevalent and full two-way communication is not required.

In short, Server-sent events are a technology that allows the server to send asynchronous updates to the client over a long-running HTTP connection. This makes it possible to stream real-time events from the server to the client without the need for explicit requests from the client.

### SWR (stale-while-revalidate) 

Vercel's SWR (stale-while-revalidate) library is a state management and data caching solution for web applications. It is designed to improve performance and user experience when handling asynchronous requests for data.

Here are the main concepts and functionalities of the SWR library:

1. **Cache Management**: SWR maintains a local cache of data retrieved from previous requests. This allows data to be reused and accessed quickly without the need for a new request to the server.

2. **Stale-while-revalidate**: SWR follows the "stale-while-revalidate" strategy to fetch updated data. When a request is made for data, SWR immediately returns the cached data (even if it is slightly out of date) and initiates a new request to the server for the latest data. This approach allows users to see the data immediately while ensuring that the data is up to date.

3. **Auto Revalidation**: After getting the cached data, SWR automatically initiates a request to get the updated data from the background server. This revalidation takes place at regular intervals to keep the data fresh and provide a real-time experience.

4. **Error Handling**: SWR automatically manages request errors such as network failures or server errors. It lets you define retry policies on errors and provides a mechanism for handling errors and displaying them in the UI.

5. **React Integration**: SWR is a library optimized for use with React. It provides custom hooks like `useSWR` that make it easy to integrate state management and data caching into React components.

The SWR library is widely used to improve performance and user experience in web applications that rely on asynchronous requests for data. It is particularly useful in scenarios where you need to display up-to-date data in real time, such as news feeds, data from dashboards or to-do lists.

In short, Vercel's SWR (stale-while-revalidate) library offers an efficient solution for state management and data caching in web applications. It allows data to be accessed quickly from the cache, while performing revalidation requests in the background to keep the data fresh. This improves performance and user experience when handling asynchronous requests for data.

## :speech_balloon: Explanations

### Philosophy vs. Object Oriented Programming



![screen](/screens/home-broker.png)



<p align="center">Project made with :blue_heart: by <a href="https://github.com/stardusteight-d4c">Gabriel Sena</a></p>







-> Falar sober Kafka
-> Microserviços
-> Server sent events
-> Watch do MongoDB
-> Observable
-> explicar componente SyncOrders

quando você faz uma requisição via localhost dentro de um container,
você está fazendo uma requisição no contexto daquele container

se você ter uma porta exposta em localhost mas o processo estiver
rodando na sua máquina ou em outro container, apenas sua máquina 
ou aquele container terá acesso à esse endereço,

por isso devemos configurar networks ou extra_hosts para a comunicação
entre containers acontecer

Fazer um script de exemplo/testes para demonstrar como todos os componentes se comunicam e a responsabilidade de cada um.

Também comentar o processo


Obs.: Isso só é aplicado para códigos via backend/server caso seja uma requisição 
executada no browser não terá efeito

// executando npm run prisma-generate e rodando o servidor com npm run start:dev 
// dentro do container app, estava recebendo o erro:

// PrismaClientInitializationError: Unable to require
// (`/home/node/app/node_modules/.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node`).
// Prisma cannot find the required `libssl` system library in your system. 
// Please install openssl and try again.

<!-- talvez seja necessario excluir a diretório dist -->

// SET -> binaryTargets = ["native", "debian-openssl-1.1.x"]
// In generator client {}

// server sent events -> servidor enviar eventos para o browser (http)
// websockets -> servidor enviar eventos para o browser (ws)

// CLIENT ---- GET /events ---- SERVER
// SERVER ---- Header (conexão de longa duração, o browser não fecha a conexão)

// Limitações
// http - aba (dominio) -  6 conexões simultaneas
// http2 - aba (dominio) -  100 conexões simultaneas

header: Connection: keep-alive
header: Cache-Control: no-cache


// brokers: ["172.18.0.1:9092"], // for internal docker network
// brokers: ["host.docker.internal:9094"], // special hostname that resolves
// to the IP address of the host machine (host) when used inside a Docker container

A função handleWalletAssetChanged é responsável por lidar com a mudança nos ativos de carteira e notificar o observer com os dados atualizados. Aqui está uma descrição passo a passo do que a função faz:

entendendo o dominio 

## Order

Uma ordem de compra, muitas vezes abreviada para PO (Purchase Order), é um documento comercial emitido por um comprador para um vendedor, indicando tipos, quantidades e preços acordados para produtos ou serviços necessários. É utilizado para controlar a compra de produtos e serviços de fornecedores externos

## Asset

É o conjunto de todos os investimentos, sejam eles feitos por pessoa física ou jurídica. Esses investimentos podem se valorizar com o passar do tempo e gerar rentabilidade sobre o capital investido no inicio.

## Wallet

A carteira de investimentos é uma união de todas as aplicações que você escolheu para fazer seu dinheiro render. 



// PING command para verificar se um endereço está ativo

 ping 172.18.0.3:27017

 O comando `ping` é utilizado para enviar pacotes ICMP e verificar a conectividade com um endereço IP. No seu exemplo, você executou o comando `ping 172.18.0.1` e recebeu respostas dos pacotes enviados, o que indica que o endereço IP 172.18.0.1 está ativo e respondendo aos pacotes ICMP.

No entanto, o comando `ping` não suporta especificar uma porta diretamente. O formato correto para utilizar o `ping` é apenas com o endereço IP ou nome de domínio, sem especificar uma porta.

Para verificar se uma porta específica está aberta e acessível em um determinado endereço IP, você pode usar outras ferramentas, como o `telnet` ou utilitários de verificação de porta, como o `nmap`.

Exemplo de uso do `telnet` para verificar uma porta:

```shell
telnet <endereço IP> <porta>
```

Por exemplo, para verificar se a porta 27017 está acessível no endereço IP 172.18.0.1, você pode executar o seguinte comando:

```shell
telnet 172.18.0.1 27017
```

Se a porta estiver aberta e acessível, você verá uma mensagem de sucesso ou uma resposta adequada do serviço ou aplicação que estiver sendo executada nessa porta. Caso contrário, você receberá uma mensagem de erro ou o comando ficará aguardando a conexão por um período de tempo e, eventualmente, expirará.

Certifique-se de usar o formato correto ao utilizar comandos como `ping` e `telnet` para verificar a conectividade e a abertura de portas em um endereço IP específico.

fixing Unable to connect to the database. Retrying
with directConnection=true

explicar control center http://localhost:9021/

erro kafka.upstash.io "This server does not host this topic-partition"
Você precisa criar os tópicos no upstash antes de tentar conectar com eles

explicar a importância de um serviço de mensageria Microservices: Quando utilizar? Vantagens e Desvantagens + Abertura das matrículas 40:00


O erro "Hydration failed because the initial UI does not match what was rendered on the server" ocorre quando há uma inconsistência entre o conteúdo renderizado inicialmente no servidor e o que está sendo hidratado no lado do cliente durante a inicialização do React.

/**
  * The rest who must validate these transactions and actually carry out the changes
  * and sync the data with this API server to the frontend with the trade-service
  * a service made in GO where the business logic and transaction calculations are
  * Kafka messaging service, so we maintain communication between systems where both
  * are reading and publishing messages, and in the case of this server, sending updates
  * via Server Sent Events to the web client. 
  */
