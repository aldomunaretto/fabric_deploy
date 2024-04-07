/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class Product {
    @Property()
    public ID: string;

    @Property()
    public Status: string;
}
