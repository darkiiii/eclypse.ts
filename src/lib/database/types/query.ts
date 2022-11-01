import {Operators, QueryType} from "./enum";

export interface  DefaultQueryOptions {
    type: QueryType | number;
    table: string;
}

export interface ConditionalQueryOptions extends DefaultQueryOptions {
    condition?: {operator: Operators, key: string, value?: any}[];
}

export interface SelectQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Select | 1;
    fields?: string[];
    limit?: number;
}


// Insert does not take conditions
export interface InsertQueryOptions extends DefaultQueryOptions {
    type: QueryType.Insert | 2;
    values: {key: string, value: any}[];
}

export interface UpdateQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Update | 3;
    modifier: {key: string, value: any}[];
}

export interface DeleteQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Delete | 4;
}

export type QueryOptions = SelectQueryOptions | InsertQueryOptions | UpdateQueryOptions | DeleteQueryOptions;
