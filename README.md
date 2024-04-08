# Supply-Chain Network en Hyperledger Fabric:

Este proyecto es una implementación de prueba de concepto para una cadena de suministro utilizando Hyperledger Fabric. Se ha modificado la test-network proporcionada por fabric-samples para simular un entorno de cadena de suministro que incluye fabricantes, transportistas y distribuidores. Además, se ha desarrollado un chaincode en TypeScript que gestiona las interacciones dentro de esta red.

## Tecnologías Utilizadas:  
- [Hyperledger Fabric v2.5](https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html): Utilizado para crear la red blockchain y ejecutar el chaincode.
- Node.js y NPM: Para ejecutar y gestionar el chaincode escrito en TypeScript.

## Modificaciones a la Test-Network:
Para adaptar la test-network a las necesidades de nuestra cadena de suministro, se realizaron las siguientes modificaciones:

### Organizaciones: 
La red incluye tres organizaciones que representan a los actores de la cadena de suministro: Fabricante (Org1), Transportista (Org2) y Distribuidor (Org3). El Fabricante y el transportista tiene ambos dos peers en la red y el Distribuidor solo tiene uno.

### Canales: 
Se configuró un canal único (mychannel) para facilitar las transacciones entre las organizaciones mencionadas.

### Chaincode: 
Se implementó y desplegó un chaincode específico para gestionar las operaciones de la cadena de suministro. 

##### Define las Entidades y sus Atributos: 
Antes de empezar a escribir el chaincode, necesitas definir claramente las entidades involucradas (Fabricante (Org1), Transportista (Org2), Distribuidor (Org3)) y qué atributos (propiedades) tendrán cada uno de los productos: 
1. ID
1. Descripción
1. Estado (Fabricado, En tránsito, Entregado al distribuidor, Entregado al minorista) 
##### Define las Operaciones del Chaincode:
Determina qué operaciones necesitarás implementar:

1. Registrar Manufactura del Producto: Realizado por el fabricante.  
1. Actualizar Estado a En Tránsito: Realizado por el transportista.  
1. Actualizar Estado a Entregado al Distribuidor: También por el transportista.  
1. Actualizar Estado a Entregado al Minorista: Realizado por el distribuidor.  

El chaincode SupplyChain gestiona los productos a lo largo de la cadena de suministro. Se implementaron las siguientes funciones:

- RegisterProduct: Permite al fabricante registrar un nuevo producto en la red, asignándole un identificador único.
- ChangeProductStatu: Permite a los transportistas y distribuidores actualizar el estado del producto (e.g., 'onTransit', 'deliveredToDistributor', 'deliveredToRetailer').
- GetProductStatus: Permite consultar el estado del producto asentado en el ledger.
- GetProduct: Permite consultar la información del producto asentado en el ledger en formato JSON.
- ProductExists: Permite consultar si el producto ya existe en el ledger.

### Cambios introducidos en el repositorio test-network para atender las necesidades del caso de uso
- Para aumentar el numero de peers de las Orgs 1 y 2, antes de levantar la test-network, modifiqué los ficheros yamls dentro de la carpeta cryptogen para preparar el material criptografico para los dos nuevos peers que tendran cada una de estas organizaciones.

- Modifiqué el bash script del connection profile (ccp-generate.sh) para que tome la variable que designe el puerto para los peer1, así como modifiqué los templates yaml y json para que incluyan la información de los peer1 para cada org.

- Modifiqué los ficheros de compose para añadir instancias de couchdb para cada uno de los nuevos peers (compose-couch.yaml) y creamos los servicios para los dos nuevos peer1 tanto en el fichero compose-test-net.yaml como en el docker-compose-test-net.yaml

- Para unir los nuevos peers al channel, se podia hacer deforma manual utilizando el comando: `peer channel join` y el fichero del bloque genesis que se encuentra en la carpeta channel-artifacts. Esto implica establecer una serie de variables de entorno: 

    export CORE_PEER_TLS_ENABLED=true  
    export CORE_PEER_LOCALMSPID="Org1MSP"  
    export CORE_PEER_TLS_ROOTCERT_FILE=organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem  
    export CORE_PEER_MSPCONFIGPATH=organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp  
    export CORE_PEER_ADDRESS=localhost:7055
    export PATH=$PWD/../bin:$PATH
    export FABRIC_CFG_PATH=${PWD}/../config/

- Finalmente modifiqué los bash script envVars.sh y createChannel.sh para hacer esto de forma automatizada.

- Durante la realización de la práctica, detecté que se han realizado [modificaciones](https://github.com/hyperledger/fabric-samples/commit/ebbc41993350f8a98442d16fe39a70fdbd73a07d) sobre el repositorio de fabric-samples, lo cual hace que el contenido de los ficheros sea distinto al visto durante las sesiones de clase.

## Instrucciones Básicas para el uso del repositorio:

1. Clone este repositorio y navegue al directorio test-network.

```bash
cd fabric-samples/test-network
```

1. Despliega la test-network de forma habitual con couchDB para las Org1 - Org2 y creamos el canal 

```bash
# Desde el directorio fabric-samples/test-network
./network.sh down
./network.sh up createChannel -s couchdb
```

1. Añade la Org3

```bash
# Desde el directorio addOrg3
cd addOrg3
./addOrg3.sh up -s couchdb
```

1. Despliega el Chaincode como servicio externo

```bash
# Desde el directorio fabric-samples/test-network
./network.sh deployCCAAS -ccn supplychain -ccp ../../supplychain-chaincode-typescript -ccl typescript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
```

1. Interactuar con el Chaincode

```bash
# Desde el directorio rest-api-go
go run cmd/main.go
```
