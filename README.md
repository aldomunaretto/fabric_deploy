# Supply-Chain Network en Hyperledger Fabric:

Este proyecto es una implementación de prueba de concepto para una cadena de suministro utilizando Hyperledger Fabric. Se ha modificado la `test-network` proporcionada por `fabric-samples` para simular un entorno de cadena de suministro que incluye fabricantes, transportistas, y distribuidores. Además, se ha desarrollado un chaincode en TypeScript que gestiona las interacciones dentro de esta red.

## Tecnologías Utilizadas

- [Hyperledger Fabric v2.5](https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html): Utilizado para crear la red blockchain y ejecutar el chaincode.
- [Node.js](https://nodejs.org/en) y [NPM](https://www.npmjs.com/): Para ejecutar y gestionar el chaincode escrito en TypeScript.
- [Go](https://golang.org/): Utilizado para crear la REST API que facilita la interacción con el chaincode.

## Modificaciones a la Test-Network

Para adaptar la `test-network` a las necesidades de nuestra cadena de suministro, se realizaron las siguientes modificaciones:

### Organizaciones

La red incluye tres organizaciones que representan a los actores de la cadena de suministro y un ordering service compuesto por un único orderer:
- Fabricante (Org1), con dos peers.
- Transportista (Org2), con dos peers.
- Distribuidor (Org3), con un solo peer.

### Canales

Se configuró un canal único (`mychannel`) para facilitar las transacciones entre las organizaciones mencionadas.

### Chaincode

Se implementó y desplegó un chaincode específico para gestionar las operaciones de la cadena de suministro, con las siguientes funcionalidades:

- **RegisterProduct**: Permite al fabricante registrar un nuevo producto en la red, asignándole un identificador único.
- **ChangeProductStatus**: Permite a los transportistas y distribuidores actualizar el estado del producto (e.g., 'onTransit', 'deliveredToDistributor', 'deliveredToRetailer').
- **GetProductStatus**: Consulta el estado actual del producto.
- **GetProduct**: Devuelve la información del producto en formato JSON.
- **ProductExists**: Verifica si un producto específico ya existe en el ledger.

## Cambios Introducidos en el Repositorio Test-Network

- **Preparación de Material Criptográfico**: Modificación de ficheros YAML dentro de `cryptogen` para los nuevos peers de Org1 y Org2.
- **Script de Perfil de Conexión**: Actualización del script `ccp-generate.sh` y los templates correspondientes para incluir los nuevos peers.
- **Composiciones de Docker**: Añadidas instancias de `couchdb` para los nuevos peers y actualización de los ficheros `docker-compose`.
- **Unión de Nuevos Peers al Canal**: Automatización mediante modificaciones en `envVars.sh` y `createChannel.sh`.
- **Despliegue de Chaincode como Servicio Externo**: ha sido modificado el script `deployCCAAS.sh` para permitir el despliegue y configuración automática del chaincode en un entorno de servicio externo en los peers de las tres organizaciones.

> **Nota**: Durante la práctica se detectaron [modificaciones en `fabric-samples`](https://github.com/hyperledger/fabric-samples/commit/ebbc41993350f8a98442d16fe39a70fdbd73a07d), lo cual puede afectar a los ficheros respecto a lo visto en clase.

## Uso del Repositorio

### Configuración Inicial

Clone este repositorio y navegue al directorio test-network.

```bash
cd test-network
```

### Despliegue de la Red

Despliegue la `test-network` con `couchdb` y cree el canal.

```bash
# Desde el directorio test-network
./network.sh down
./network.sh up createChannel -s couchdb
```

### Añadir Org3

```bash
# Desde el directorio test-network/addOrg3
./addOrg3.sh up -s couchdb
```

### Despliegue del Chaincode como Servicio Externo

```bash
# Desde el directorio test-network
./network.sh deployCCAAS -ccn supplychain -ccp ../supplychain-chaincode-typescript -ccl typescript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
```

### Interacción con el Chaincode

```bash
# Desde el directorio rest-api-go
go run cmd/main.go
```

### Borrar la red y artefactos completamente

```bash
# Desde el directorio test-network
./network.sh down
docker rm -f $(docker ps -aq)
docker volume prune -af
```