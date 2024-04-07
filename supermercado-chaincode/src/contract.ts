/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
const ClientIdentity = require('fabric-shim').ClientIdentity;
import stringify from 'json-stringify-deterministic';
import { Producto } from './producto';

@Info({title: 'ContratoSupermercado', description: 'Chaincode supermercado para registro y trazabilidad de productos'})
export class ProductoContract extends Contract {

    // RegistrarProducto crea una nueva clave en el ledger y le asigna el estado recibido
    @Transaction()
    public async RegistrarProducto(ctx: Context, id: string): Promise<void> {
        const exists = await this.ProductoExiste(ctx, id);
        if (exists) {
            throw new Error(`Este producto ya ha sido registrado`);
        }

        let cid = new ClientIdentity(ctx.stub);
        const mspID = cid.getMSPID();

        if (mspID !== 'Org2MSP') {
            throw new Error(`Este participante no puede registrar productos`);
        }

        const producto: Producto = {
            ID: id,
            Estado: 'Creado',
        };
        await ctx.stub.putState(id, Buffer.from(stringify(producto)));
    }

    // ReadAsset devuelve un asset de la blockchain en formato JSON.
    @Transaction(false)
    public async LeerProducto(ctx: Context, id: string): Promise<string> {
        const productoJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!productoJSON || productoJSON.length === 0) {
            throw new Error(`No existe`);
        }
        return productoJSON.toString();
    }

    // ProductoExiste devuelve si un asset con el id recibido existe en el world state.
    @Transaction(false)
    @Returns('boolean')
    public async ProductoExiste(ctx: Context, id: string): Promise<boolean> {
        const productoJSON = await ctx.stub.getState(id);
        return productoJSON && productoJSON.length > 0;
    }
}
