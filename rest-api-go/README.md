# Transactions REST API - GOLANG

## Introducción

Este servicio es un fork del repositorio [fabric connector](https://www.github.com/d-m1/gin-fabric-connector), creado para el módulo **Cómo Desplegar una red de Fabric** del bootcamp de Blockchain de **Keepcoding**. Mediante un servidor API REST, se exponen dos rutas que nos permitiran interactuar de forma sencilla con los chaincodes desplegados en un canal sin necesidad de usar las herramientas de CLI. Para la conexión con los peers, se utiliza fabric-gateway.

## Uso

1. Despliega la test-network de forma habitual con couchDB

```bash
# Desde el directorio fabric-samples/test-network
./network.sh down
./network.sh up createChannel -s couchdb
```

1. Despliega el Chaincode 

```bash
# Desde el directorio fabric-samples/test-network
./network.sh deployCCAAS -ccn supplychain -ccp ../../supplychain-chaincode-typescript -ccl typescript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
```

1. Ejecuta el servidor mediante el siguiente comando desde la raíz del proyecto

```bash
go run cmd/main.go
```

## Referencia del API REST

- **POST /transaction**: Operaciones de invocación (invoke) se utilizan para modificar el estado del ledger de un canal mediante la ejecución de funciones de un chaincode. Estas transacciones si son validadas por el algoritmo de consenso e incluídas en un bloque
- **GET  /transaction**: Operaciones de consulta (query) se utilizan para leer o consultar el estado actual del ledger de un canal sin realizar cambios en él y para simular transacciones
