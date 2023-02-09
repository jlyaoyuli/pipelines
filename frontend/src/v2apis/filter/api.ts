/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * backend/api/v2beta1/filter.proto
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: version not set
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


import * as url from "url";
import * as portableFetch from "portable-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "http://localhost".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}

/**
 *  
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 * 
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = portableFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 * 
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name: "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * List of integers.
 * @export
 * @interface PredicateIntValues
 */
export interface PredicateIntValues {
    /**
     * 
     * @type {Array<number>}
     * @memberof PredicateIntValues
     */
    values?: Array<number>;
}

/**
 * List of long integers.
 * @export
 * @interface PredicateLongValues
 */
export interface PredicateLongValues {
    /**
     * 
     * @type {Array<string>}
     * @memberof PredicateLongValues
     */
    values?: Array<string>;
}

/**
 * List of strings.
 * @export
 * @interface PredicateStringValues
 */
export interface PredicateStringValues {
    /**
     * 
     * @type {Array<string>}
     * @memberof PredicateStringValues
     */
    values?: Array<string>;
}

/**
 * Filter is used to filter resources returned from a ListXXX request.  Example filters: 1) Filter runs with status = 'Running' filter {   predicate {     key: \"status\"     op: EQUALS     string_value: \"Running\"   } }  2) Filter runs that succeeded since Dec 1, 2018 filter {   predicate {     key: \"status\"     op: EQUALS     string_value: \"Succeeded\"   }   predicate {     key: \"created_at\"     op: GREATER_THAN     timestamp_value {       seconds: 1543651200     }   } }  3) Filter runs with one of labels 'label_1' or 'label_2'  filter {   predicate {     key: \"label\"     op: IN     string_values {       value: 'label_1'       value: 'label_2'     }   } }
 * @export
 * @interface V2beta1Filter
 */
export interface V2beta1Filter {
    /**
     * All predicates are AND-ed when this filter is applied.
     * @type {Array<V2beta1Predicate>}
     * @memberof V2beta1Filter
     */
    predicates?: Array<V2beta1Predicate>;
}

/**
 * Predicate captures individual conditions that must be true for a resource being filtered.
 * @export
 * @interface V2beta1Predicate
 */
export interface V2beta1Predicate {
    /**
     * 
     * @type {V2beta1PredicateOperation}
     * @memberof V2beta1Predicate
     */
    operation?: V2beta1PredicateOperation;
    /**
     * Key for the operation (first argument).
     * @type {string}
     * @memberof V2beta1Predicate
     */
    key?: string;
    /**
     * Integer.
     * @type {number}
     * @memberof V2beta1Predicate
     */
    int_value?: number;
    /**
     * Long integer.
     * @type {string}
     * @memberof V2beta1Predicate
     */
    long_value?: string;
    /**
     * String.
     * @type {string}
     * @memberof V2beta1Predicate
     */
    string_value?: string;
    /**
     * Timestamp values will be converted to Unix time (seconds since the epoch) prior to being used in a filtering operation.
     * @type {Date}
     * @memberof V2beta1Predicate
     */
    timestamp_value?: Date;
    /**
     * Array values below are only meant to be used by the IN operator.
     * @type {PredicateIntValues}
     * @memberof V2beta1Predicate
     */
    int_values?: PredicateIntValues;
    /**
     * List of long integers.
     * @type {PredicateLongValues}
     * @memberof V2beta1Predicate
     */
    long_values?: PredicateLongValues;
    /**
     * List of strings.
     * @type {PredicateStringValues}
     * @memberof V2beta1Predicate
     */
    string_values?: PredicateStringValues;
}

/**
 * Operation is the operation to apply.   - OPERATION_UNSPECIFIED: Default operation. This operation is not used.  - EQUALS: Operation on scalar values. Only applies to one of |int_value|, |long_value|, |string_value| or |timestamp_value|.  - NOT_EQUALS: Negated EQUALS.  - GREATER_THAN: Greater than operation.  - GREATER_THAN_EQUALS: Greater than or equals operation.  - LESS_THAN: Less than operation.  - LESS_THAN_EQUALS: Less than or equals operation  - IN: Checks if the value is a member of a given array, which should be one of |int_values|, |long_values| or |string_values|.  - IS_SUBSTRING: Checks if the value contains |string_value| as a substring match. Only applies to |string_value|.
 * @export
 * @enum {string}
 */
export enum V2beta1PredicateOperation {
    OPERATIONUNSPECIFIED = <any> 'OPERATION_UNSPECIFIED',
    EQUALS = <any> 'EQUALS',
    NOTEQUALS = <any> 'NOT_EQUALS',
    GREATERTHAN = <any> 'GREATER_THAN',
    GREATERTHANEQUALS = <any> 'GREATER_THAN_EQUALS',
    LESSTHAN = <any> 'LESS_THAN',
    LESSTHANEQUALS = <any> 'LESS_THAN_EQUALS',
    IN = <any> 'IN',
    ISSUBSTRING = <any> 'IS_SUBSTRING'
}


