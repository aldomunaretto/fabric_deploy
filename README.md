# fabric_deploy
Repository to deploy an Hyperledger Fabric test-network 

voy a utilizar la versión 2.5 de fabric que es la LTS
[install hyperledger-fabric 2.5](https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html)

curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh

./install-fabric.sh -h
Usage: ./install-fabric.sh [-f|--fabric-version <arg>] [-c|--ca-version <arg>] <comp-1> [<comp-2>] ... [<comp-n>] ...
        <comp> Component to install, one or more of  docker | binary | samples | podman  First letter of component also accepted; If none specified docker | binary | samples is assumed
        -f, --fabric-version: FabricVersion (default: '2.5.6')
        -c, --ca-version: Fabric CA Version (default: '1.5.9')


./install-fabric.sh docker samples binary

1. Define las Entidades y sus Atributos
Antes de empezar a escribir el chaincode, necesitas definir claramente las entidades involucradas (Fabricante (Org1), Transportista (Org2), Distribuidor (Org3)) y qué atributos (propiedades) tendrá cada una. Por ejemplo:

Producto: ID, Descripción, Estado (Registrado, En tránsito, Entregado al distribuidor, Entregado al minorista), etc.
2. Define las Operaciones del Chaincode
Determina qué operaciones necesitarás implementar. Basándose en tu descripción, podrían ser:

Registrar Producto: Realizado por el fabricante.
Actualizar Estado a En Tránsito: Realizado por el transportista.
Actualizar Estado a Entregado al Distribuidor: También por el transportista.
Actualizar Estado a Entregado al Minorista: Realizado por el distribuidor.


Supply Chain Network on Hyperledger Fabric
Este proyecto es una implementación de prueba de concepto para una cadena de suministro utilizando Hyperledger Fabric. Se ha modificado la test-network proporcionada por fabric-samples para simular un entorno de cadena de suministro que incluye fabricantes, transportistas y distribuidores. Además, se ha desarrollado un chaincode en TypeScript que gestiona las interacciones dentro de esta red.

Modificaciones a la Test-Network
Para adaptar la test-network a las necesidades de nuestra cadena de suministro, se realizaron las siguientes modificaciones:

Organizaciones: La red incluye tres organizaciones que representan a los actores de la cadena de suministro: Fabricante, Transportista, y Distribuidor. Cada organización tiene su propio peer en la red.
Canales: Se configuró un canal único (supplychainchannel) para facilitar las transacciones entre las organizaciones mencionadas.
Chaincode: Se implementó y desplegó un chaincode específico para gestionar las operaciones de la cadena de suministro, descrito en detalle en la sección siguiente.
Chaincode de la Cadena de Suministro
El chaincode SupplyChain gestiona los productos a lo largo de la cadena de suministro. Se implementaron las siguientes funciones:

registerProduct: Permite al fabricante registrar un nuevo producto en la red, asignándole un identificador único y una descripción.
updateState: Permite a los transportistas y distribuidores actualizar el estado del producto (e.g., 'En tránsito', 'Entregado al distribuidor', 'Entregado al minorista').
Tecnologías Utilizadas
Hyperledger Fabric v2.x: Utilizado para crear la red blockchain y ejecutar el chaincode.
Node.js y NPM: Para ejecutar y gestionar el chaincode escrito en TypeScript.


Instrucciones Básicas
Clone este repositorio y navegue al directorio test-network.
Ejecute ./network.sh up createChannel -s couchdb para iniciar la red y crear el canal.

Despliegue el chaincode SupplyChain utilizando ./network.sh deployCCAAS -ccn supplychain -ccp ../../supplychain-chaincode-typescript -ccl typescript -ccep "OR('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"