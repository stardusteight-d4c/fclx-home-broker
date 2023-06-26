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