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

Obs.: Isso só é aplicado para códigos via backend/server caso seja uma requisição 
executada no browser não terá efeito

// server sent events -> servidor enviar eventos para o browser (http)
// websockets -> servidor enviar eventos para o browser (ws)

// CLIENT ---- GET /events ---- SERVER
// SERVER ---- Header (conexão de longa duração, o browser não fecha a conexão)

// Limitações
// http - aba (dominio) -  6 conexões simultaneas
// http2 - aba (dominio) -  100 conexões simultaneas

header: Connection: keep-alive
header: Cache-Control: no-cache
