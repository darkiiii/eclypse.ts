import type {Operators, QueryType} from "./enum";

export interface  DefaultQueryOptions {
    table: string;
    type: QueryType;
}

export interface ConditionalQueryOptions extends DefaultQueryOptions {
    condition?: {key: string, operator: Operators, value?: any}[];
}

export interface SelectQueryOptions extends ConditionalQueryOptions {
    fields?: string[];
    limit?: number;
    type: QueryType.Select;
}

// Insert does not take conditions
export interface InsertQueryOptions extends DefaultQueryOptions {
    type: QueryType.Insert;
    values: {key: string, value: any}[];
}

export interface UpdateQueryOptions extends ConditionalQueryOptions {
    modifier: {key: string, value: any}[];
    type: QueryType.Update;
}

export interface DeleteQueryOptions extends ConditionalQueryOptions {
    type: QueryType.Delete;
}

export type QueryOptions = DeleteQueryOptions | InsertQueryOptions | SelectQueryOptions | UpdateQueryOptions;
