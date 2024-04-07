/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class SupplyChain extends Contract {

    // registerProduct adds a new product to the world state with status Regitered.
    async registerProduct(ctx, productId, description) {
        const exists = await this.ProductExists(ctx, id);
        if (exists) {
            throw new Error(`The product ${id} already exists`);
        }
        console.info('Registering product');

        const product = {
            description: description,
            status: 'Registered',
            docType: 'product',
        };

        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));
        return JSON.stringify(product);
    }

    // async updateStatus(ctx, productId, newStatus) {
    //     console.info('Updating product status');

    //     const productoAsBytes = await ctx.stub.getState(productId);
    //     if (!productoAsBytes || productoAsBytes.length === 0) {
    //         throw new Error(`El producto ${productId} no existe`);
    //     }
    //     let producto = JSON.parse(productoAsBytes.toString());
    //     producto.estado = nuevoEstado;

    //     await ctx.stub.putState(productId, Buffer.from(JSON.stringify(producto)));
    //     return JSON.stringify(producto);
    // }

    // ProductExists returns true when product with given ID exists in world state.
    async ProductExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
}

module.exports = SupplyChain;