/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
const ClientIdentity = require('fabric-shim').ClientIdentity;
import stringify from 'json-stringify-deterministic';
import { Product } from './product';

@Info({title: 'Supply-Chain Contract', description: 'Chaincode for managing the supply chain of products'})
export class ProductContract extends Contract {

    // RegisterProduct creates a new key on the ledger and assing Manufactured Status to it.
    @Transaction()
    public async RegisterProduct(ctx: Context, id: string): Promise<void> {
        const exists = await this.ProductExists(ctx, id);
        if (exists) {
            throw new Error(`The product ${id} already exists`);
        }

        let cid = new ClientIdentity(ctx.stub);
        const mspID = cid.getMSPID();

        if (mspID !== 'Org1MSP') {
            throw new Error(`This peer is not authorized to register products`);
        }

        const product: Product = {
            ID: id,
            Status: 'Manufactured',
        };
        await ctx.stub.putState(id, Buffer.from(stringify(product)));
    }

    // ChangeProductStatus updates the product's status on the ledger according the Org that calls the transaction.
    @Transaction()
    public async ChangeProductStatus(ctx: Context, id: string): Promise<void> {
        const productJSON = await ctx.stub.getState(id);
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${id} does not exist`);
        }
        const product: Product = JSON.parse(productJSON.toString());

        let cid = new ClientIdentity(ctx.stub);
        const mspID = cid.getMSPID();
    
        let newStatus: string;
        switch (mspID) {
            case 'Org2MSP':
                newStatus = product.Status === 'onTransit' ? 'deliveredToDistributor' : 'onTransit';
                break;
            case 'Org3MSP':
                newStatus = 'deliveredToRetailer';
                break;
            default:
                throw new Error(`The organization ${mspID} is not authorized to change product status`);
        }

        if (product.Status !== newStatus) {
    
            const notification = {
                eventType: 'productStatusChange',
                id: id,
                oldStatus: product.Status,
                newStatus: newStatus,
                mspID: mspID
            };
            ctx.stub.setEvent('ProductStatusChangeEvent', Buffer.from(JSON.stringify(notification)));

            product.Status = newStatus;
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
        }
    }

    // GetProductStatus returns the product's status with the given ID from the ledger.
    @Transaction(false)
    public async GetProductStatus(ctx: Context, id: string): Promise<string> {
        const productJSON = await ctx.stub.getState(id);
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${id} does not exist`);
        }
        const product: Product = JSON.parse(productJSON.toString());
        return product.Status;
    }

    // GetProduct returns the product's information with the given ID from the ledger in JSON format.
    @Transaction(false)
    public async GetProduct(ctx: Context, id: string): Promise<Product> {
        const productJSON = await ctx.stub.getState(id);
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${id} does not exist`);
        }
        return JSON.parse(productJSON.toString());
    }

    // ProductExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async ProductExists(ctx: Context, id: string): Promise<boolean> {
        const productJSON = await ctx.stub.getState(id);
        return productJSON && productJSON.length > 0;
    }
}
