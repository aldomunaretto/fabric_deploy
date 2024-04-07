package blockchain

// Transaction representa los atributos necesarios para una transacción invoke/query
type Transaction struct {
	Channel   string   `json:"channel" validate:"required"`
	Chaincode string   `json:"chaincode" validate:"required"`
	Function  string   `json:"function" validate:"required"`
	Arguments []string `json:"arguments"`
}

// TransactionResponse representa el resultado de una transacción invoke/query
type TransactionResponse struct {
	Status string      `json:"status"`
	Result interface{} `json:"result"`
}
