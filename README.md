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

### Understanding the domain

 - <strong>Asset</strong>: It is the set of all investments, whether made by individuals or legal entities. These investments can increase in value over time and generate returns on the capital invested at the beginning.
 
 - <strong>Wallet</strong>: The investment portfolio is a union of all the applications you have chosen to make your money yield.

- <strong>Order</strong>: A purchase order, often abbreviated to PO (Purchase Order), is a commercial document issued by a buyer to a seller, indicating types, quantities and agreed prices for required products or services. It is used to control the purchase of products and services from external suppliers

- <strong>Transaction</strong>: It involves the `creation of a purchase or sale order of a certain financial asset`. The buy or sell order is recorded with details such as the asset identifier, the investor's portfolio identifier, the price, the number of shares and the type of transaction (buy or sell). These transactions are processed by the system to execute the asset purchase or sale operations, updating portfolio information and registering the status of the order (such as "PENDING" or "CLOSED").

```js
// kafka messages (input topic)

{
  "order_id": "1",
  "investor_id": "Celia",
  "asset_id": "asset1",
  "current_shares": 0,
  "shares": 5,
  "price": 5.0,
  "order_type": "BUY"
}

{
  "order_id": "1",
  "investor_id": "Mari",
  "asset_id": "asset1",
  "current_shares": 10,
  "shares": 5,
  "price": 5.0,
  "order_type": "SELL"
}

// kafka messages (output topic)

// sales order transaction
transaction performed:  {
  "order_id": "1",
  "investor_id": "Mari",
  "asset_id": "asset1",
  "order_type": "SELL",
  "status": "CLOSED",
  "partial": 0,
  "shares": 5,
  "transactions": [
    {
      "transaction_id": "6fe28de3-8069-41a1-b62a-616b6aa766c3",
      "buyer_id": "1",
      "seller_id": "1",
      "asset_id": "asset1",
      "price": 5,
      "shares": 5
    }
  ]
}

// purchase order transaction
transaction performed:  {
  "order_id": "1",
  "investor_id": "Celia",
  "asset_id": "asset1",
  "order_type": "BUY",
  "status": "CLOSED",
  "partial": 0,
  "shares": 5,
  "transactions": [
    {
      "transaction_id": "6fe28de3-8069-41a1-b62a-616b6aa766c3",
      "buyer_id": "1",
      "seller_id": "1",
      "asset_id": "asset1",
      "price": 5,
      "shares": 5
    }
  ]
}
```

### Watch Database and Observable Instance (rxjs library) 

1. The `subscribeAssetDailyEvents` function is responsible for subscribing to the daily events of a specific asset. It takes the asset ID as a parameter.

2. Inside the function, the `subscribeAssetDailyEvents` method of the assetService service is called. This method returns an `Observable` that emits events related to the asset's daily events.

3. The `Observable` returned by `assetService.subscribeAssetDailyEvents` is then mapped using the map function. This allows the format of the event to be transformed into the format expected by the subscribeAssetDailyEvents function. The event originally emitted by the service contains an event field and a data field, while the subscribeAssetDailyEvents function expects an object with a type field and a data field.

4. The `subscribeAssetDailyEvents` function returns the resulting Observable after the transformation.

```ts
// server/src/controllers/asset.controller.ts

@Sse("daily/events")
  public subscribeAssetDailyEvents(
    @Param("id") id: string
  ): Observable<MessageEvent> {
    return this.assetService.subscribeAssetDailyEvents(id).pipe(
      map((event) => ({
        type: event.event,
        data: event.data,
      }))
    );
  }
}
```

*The `pipe` method of the `Observable` is used to chain operators that manipulate the values ​​emitted by the original Observable. It allows you to add transformations, filtering, blending or other operations to emitted values ​​before they are delivered to observers.*

```ts
// server/src/services/asset.service.ts

public subscribeAssetDailyEvents(asset_id: string): Observable<{
  event: "asset-daily-created";
  data: AssetDaily;
}> {
  return new Observable((observer) => {
    this.assetDailyModel
      .watch(getInsertPipeline(asset_id), fullDocumentUpdateLookup)
      .on("change", async (data) =>
        this.#handler.handleAssetDailyCreated({
          changedData: data,
          observer,
        })
      );
  });
}
```

5. The `watch` method is functionality provided by the database, in this case, to watch for changes in a given set of data.

6. It takes an `aggregation pipeline` (in this case, getInsertPipeline(asset_id)) and a full document update function (like `fullDocumentUpdateLookup`) as arguments.

7. When changes occur to the data that match the aggregation pipeline, the `change` event is triggered.

```ts
// server/src/services/@helpers/asset.handler.ts

public async handleAssetDailyCreated(request: {
    changedData: any;
    observer: Subscriber<{
      event: "asset-daily-created";
      data: AssetDaily;
    }>;
  }) {
    const asset = await this.#prismaService.assetDaily.findUnique({
      where: {
        id: request.changedData.fullDocument._id + "",
      },
    });
    request.observer.next({ event: "asset-daily-created", data: asset });
  }
```

8. Within the `change` event handler, the `handleAssetDailyCreated` function is called. This function is responsible for processing changes to the data and notifying the `Observer` with the `asset-daily-created` event and associated data.

#### Observable      
An observable is an object that emits events (or values) over time and allows other observers to subscribe to receive those events.

In the context of the presented code, the observable is used to create a communication channel between the database service (which emits the events) and the observers that are interested in these changes.

When a change occurs in the observed data (in this case, changes in the asset's daily events), the observable notifies the subscribed observers, sending the event and associated data.

Observers can subscribe to the observable using the `subscribe` method. When subscribing, they provide callback functions to handle the events emitted by the observable.

In the provided example, the `subscribeAssetDailyEvents` function returns the observable that emits events related to the asset's daily events. These events are processed and transformed before being emitted to interested observers.

#### Watch

In short, the "watch" feature of the database allows you to observe changes in data in real time. The observable acts as a communication channel between the database service (the event sender) and the observers interested in these changes. It allows observers to subscribe to receive events emitted by the database when observed data changes.

The "watch" feature is a feature offered by some databases, such as MongoDB, that allows developers to watch data changes in real time. Instead of having to periodically query the database for updates.

By using the "watch" feature, you can monitor a specific dataset and be notified of insert, update, or delete events that occur on that data. These events are emitted by the database and can be captured and processed by your code.

By using "watch" in conjunction with observables from the Observer pattern, you can create asynchronous and reactive communication between the database and your application. Watchers subscribe to events emitted by the "watch" and can take actions based on these changes, such as updating the user interface, processing modified data, or making business decisions.

This combination of the "watch" feature and observables allows your application to be notified in real time of data changes, rather than having to constantly query the database. This improves efficiency, reduces latency, and allows your application to respond immediately to changes in observed data.

In summary, the database "watch" feature, when used in conjunction with observables, provides an efficient and reactive way to observe data changes in real time, allowing your application to be asynchronously notified of these changes and take appropriate actions.

### Problems and inconveniences

#### Accessing localhost and containers

When you make a `request to localhost` inside a container, you are making a request in the context of that container, if you have an exposed port on localhost but the process is running on your machine or in another container, just your machine or that another container will have access to that address.

```yaml
version: "3"

services:
  app:
    container_name: application
    build: .
    ports:
      - 3000:3000 # nestjs server
      - 5555:5555 # prisma studio
    volumes:
      - .:/home/node/app
    networks:
      - fcexperience

  mongodb:
    container_name: mongodb
    build: ./mongodb_rs
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: db
      MONGO_REPLICA_HOST: localhost
      MONGO_REPLICA_PORT: 27017
    ports:
      - "27017:27017"
    volumes:
      - ./data:/data/db
    networks:
      - fcexperience

networks:
  fcexperience:
    external: true
```

Initially I was running the backend application process on my machine, and consequently I was able to access the database that was running inside the `mongodb` service with the string: `mongodb://admin:password@localhost:27017/db?authSource =admin&directConnection=true`, as the process is also being exposed outside the container on port 27017, more specifically to the host machine. When I added the backend application in a container the connection string was already faulty, but even changing it to `mongodb://admin:password@mongodb:27017/db?authSource=admin&directConnection=true` and specifying the IP address as the of the `mongodb` service, the `app` container would still not be able to connect to the database, as both `would not be on the same Docker network`, so make sure that the MongoDB container and the application container backend are on the same network as Docker to allow communication between them. If they are on different networks they will not be able to communicate.

```js
brokers: ["172.18.0.1:9092"], // for internal docker network
brokers: ["host.docker.internal:9094"], // special hostname that resolves
// to the IP address of the host machine (host) when used inside a Docker container
```

#### Ping and Telnet commands

The `ping` command is a widely used command-line tool for testing network connectivity between a source device and a destination device. The command sends Internet Control Message Protocol (ICMP) Echo Request packets to the destination and waits for ICMP Echo Reply responses. Upon receiving responses, the `ping` command displays information about latency, packet loss and other statistics related to the communication with the destination.

```shell
ping 172.18.0.1
```

When executing the `ping 172.18.0.1` command and receiving responses from the sent packets, it indicates that the IP address 172.18.0.1 is up and responding to ICMP packets.

However, the `ping` command does not support specifying a port directly. The correct format to use `ping` is with just the IP address or domain name, without specifying a port.

To check if a specific port is open and reachable on a given IP address, you can use other tools like `telnet` or port checking utilities like `nmap`.

Example of using `telnet` to check a port:

``` shell
telnet <IP address> <port>
```

For example, to verify that port 27017 is reachable from IP address 172.18.0.1, you could run the following command:

``` shell
>> telnet 172.18.0.1 27017
```

If the port is open and reachable, you will see a success message or proper response from the service or application running on that port. Otherwise, you will get an error message or the command will wait for the connection for a period of time and eventually time out.

Be sure to use the correct format when using commands such as `ping` and `telnet` to verify connectivity and port opening on a specific IP address.

``` shell
>> telnet 0.0.0.0 3000
Trying 0.0.0.0...
telnet: Unable to connect to remote host: Connection refused
```

![screen](/home-broker.png)

<p align="center">Project made with :blue_heart: by <a href="https://github.com/stardusteight-d4c">Gabriel Sena</a></p>

