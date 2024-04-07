/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const supplyChain = require('./lib/supplyChain');

module.exports.SupplyChain = supplyChain;
module.exports.contracts = [supplyChain];
