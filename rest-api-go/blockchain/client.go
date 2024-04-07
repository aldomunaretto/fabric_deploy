package blockchain

import (
	"encoding/json"
	"fmt"
)

type FabricClient struct {
	gm *GatewayManager
}

// GetClient devuelve una instancia de FabricClient para enviar transacciones
func GetClient() (*FabricClient, error) {
	gm := &GatewayManager{}
	err := gm.Init()
	if err != nil {
		fmt.Println("Failed to initialize Gateway Manager:", err.Error())
		return nil, err
	}

	fc := &FabricClient{
		gm: gm,
	}
	return fc, nil
}

// Submit envia una propuesta de transacción a los endorsing peers y espera de forma síncrona su confirmación utilizando Fabric Gateway
func (fc *FabricClient) Submit(tx Transaction) (response *TransactionResponse) {
	gateway, err := fc.gm.GetGateway()
	if err != nil {
		msg := fmt.Sprintf("Failed to retrieve Fabric Gateway: %s", err.Error())
		fmt.Println(msg)
		return &TransactionResponse{
			Status: "KO",
			Result: msg,
		}
	}

	network := gateway.GetNetwork(tx.Channel)
	contract := network.GetContract(tx.Chaincode)

	result, err := contract.SubmitTransaction(tx.Function, tx.Arguments...)
	return parseResponse(result, err)
}

// Evaluate consulta el estado del world state sin actualizar el ledger utilizando Fabric Gateway
func (fc *FabricClient) Evaluate(tx Transaction) (response *TransactionResponse) {
	gateway, err := fc.gm.GetGateway()
	if err != nil {
		msg := fmt.Sprintf("Failed to retrieve Fabric Gateway: %s", err.Error())
		fmt.Println(msg)
		return &TransactionResponse{
			Status: "KO",
			Result: msg,
		}
	}

	network := gateway.GetNetwork(tx.Channel)
	contract := network.GetContract(tx.Chaincode)

	result, err := contract.EvaluateTransaction(tx.Function, tx.Arguments...)
	return parseResponse(result, err)
}

func parseResponse(result []byte, err error) (response *TransactionResponse) {
	if err != nil {
		fmt.Println("Transaction failed:", err.Error())
		return &TransactionResponse{
			Status: "KO",
			Result: err.Error(),
		}
	}
	return &TransactionResponse{
		Status: "OK",
		Result: parseResult(result),
	}
}

func parseResult(result []byte) interface{} {
	var resultAsJSON interface{}
	err := json.Unmarshal([]byte(result), &resultAsJSON)
	if err != nil {
		return string(result)
	}
	return resultAsJSON
}
