import {Operators, QueryType} from "./enum";

export interface  DefaultQueryOptions {
    type: QueryType;
    table: string;
}

export interface ConditionalQueryOptions extends DefaultQueryOptions {
    condition?: {operator: Operators, key: string, value?: any}[];
}

export interface SelectQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Select;
    fields?: string[];
    limit?: number;
}

// Insert does not take conditions
export interface InsertQueryOptions extends DefaultQueryOptions {
    type: QueryType.Insert;
    values: {key: string, value: any}[];
}

export interface UpdateQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Update;
    modifier: {key: string, value: any}[];
}

export interface DeleteQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Delete;
}

export type QueryOptions = SelectQueryOptions | InsertQueryOptions | UpdateQueryOptions | DeleteQueryOptions;
