import * as ts from "typescript";
import { JSONSchema7 } from "json-schema";
export { Program, CompilerOptions, Symbol } from "typescript";
export declare function getDefaultArgs(): Args;
export declare type ValidationKeywords = {
    [prop: string]: boolean;
};
export declare type Args = {
    ref: boolean;
    aliasRef: boolean;
    topRef: boolean;
    titles: boolean;
    defaultProps: boolean;
    noExtraProps: boolean;
    propOrder: boolean;
    typeOfKeyword: boolean;
    required: boolean;
    strictNullChecks: boolean;
    esModuleInterop: boolean;
    ignoreErrors: boolean;
    out: string;
    validationKeywords: string[];
    include: string[];
    excludePrivate: boolean;
    uniqueNames: boolean;
    rejectDateType: boolean;
    id: string;
    defaultNumberType: "number" | "integer";
    tsNodeRegister: boolean;
};
export declare type PartialArgs = Partial<Args>;
export declare type PrimitiveType = number | boolean | string | null;
declare type RedefinedFields = "type" | "items" | "additionalItems" | "contains" | "properties" | "patternProperties" | "additionalProperties" | "dependencies" | "propertyNames" | "if" | "then" | "else" | "allOf" | "anyOf" | "oneOf" | "not" | "definitions";
export declare type DefinitionOrBoolean = Definition | boolean;
export interface Definition extends Omit<JSONSchema7, RedefinedFields> {
    type?: string | string[];
    propertyOrder?: string[];
    defaultProperties?: string[];
    typeof?: "function";
    items?: DefinitionOrBoolean | DefinitionOrBoolean[];
    additionalItems?: DefinitionOrBoolean;
    contains?: JSONSchema7;
    properties?: {
        [key: string]: DefinitionOrBoolean;
    };
    patternProperties?: {
        [key: string]: DefinitionOrBoolean;
    };
    additionalProperties?: DefinitionOrBoolean;
    dependencies?: {
        [key: string]: DefinitionOrBoolean | string[];
    };
    propertyNames?: DefinitionOrBoolean;
    if?: DefinitionOrBoolean;
    then?: DefinitionOrBoolean;
    else?: DefinitionOrBoolean;
    allOf?: DefinitionOrBoolean[];
    anyOf?: DefinitionOrBoolean[];
    oneOf?: DefinitionOrBoolean[];
    not?: DefinitionOrBoolean;
    definitions?: {
        [key: string]: DefinitionOrBoolean;
    };
}
export declare type SymbolRef = {
    name: string;
    typeName: string;
    fullyQualifiedName: string;
    symbol: ts.Symbol;
};
export declare function regexRequire(value: string): RegExpExecArray | null;
export declare class JsonSchemaGenerator {
    private args;
    private tc;
    private symbols;
    private allSymbols;
    private userSymbols;
    private inheritingTypes;
    private ignoreDocs;
    private reffedDefinitions;
    private schemaOverrides;
    private userValidationKeywords;
    private typeNamesById;
    private typeIdsByName;
    constructor(symbols: SymbolRef[], allSymbols: {
        [name: string]: ts.Type;
    }, userSymbols: {
        [name: string]: ts.Symbol;
    }, inheritingTypes: {
        [baseName: string]: string[];
    }, tc: ts.TypeChecker, args?: Args);
    get ReffedDefinitions(): {
        [key: string]: Definition;
    };
    private isFromDefaultLib;
    private resetSchemaSpecificProperties;
    private getDocsBySymbol;
    private parseCommentsIntoDefinition;
    private getDefinitionForRootType;
    private getReferencedTypeSymbol;
    private getDefinitionForProperty;
    private getEnumDefinition;
    private getUnionDefinition;
    private getIntersectionDefinition;
    private buildIgnoresDocs;
    private getClassDefinition;
    private getTypeName;
    private makeTypeNameUnique;
    private recursiveTypeRef;
    private getTypeDefinition;
    setSchemaOverride(symbolName: string, schema: Definition): void;
    getSchemaForSymbol(symbolName: string, includeReffedDefinitions?: boolean): Definition;
    getSchemaForSymbols(symbolNames: string[], includeReffedDefinitions?: boolean): Definition;
    getSymbols(name?: string): SymbolRef[];
    getUserSymbols(): string[];
    getMainFileSymbols(program: ts.Program, onlyIncludeFiles?: string[]): string[];
}
export declare function getProgramFromFiles(files: string[], jsonCompilerOptions?: any, basePath?: string): ts.Program;
export declare function buildGenerator(program: ts.Program, args?: PartialArgs, onlyIncludeFiles?: string[]): JsonSchemaGenerator | null;
export declare function generateSchema(program: ts.Program, fullTypeName: string, args?: PartialArgs, onlyIncludeFiles?: string[], externalGenerator?: JsonSchemaGenerator): Definition | null;
export declare function programFromConfig(configFileName: string, onlyIncludeFiles?: string[]): ts.Program;
export declare function exec(filePattern: string, fullTypeName: string, args?: Args): Promise<void>;
