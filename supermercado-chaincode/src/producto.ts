/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Producto {
    @Property()
    public ID: string;

    @Property()
    public Estado: string;
}
