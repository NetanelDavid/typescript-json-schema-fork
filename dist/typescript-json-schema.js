"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.programFromConfig = exports.generateSchema = exports.buildGenerator = exports.getProgramFromFiles = exports.JsonSchemaGenerator = exports.regexRequire = exports.getDefaultArgs = void 0;
var glob = require("glob");
var safe_stable_stringify_1 = require("safe-stable-stringify");
var path = require("path");
var crypto_1 = require("crypto");
var ts = require("typescript");
var path_equal_1 = require("path-equal");
var vm = require("vm");
var REGEX_FILE_NAME_OR_SPACE = /(\bimport\(".*?"\)|".*?")\.| /g;
var REGEX_TSCONFIG_NAME = /^.*\.json$/;
var REGEX_TJS_JSDOC = /^-([\w]+)\s+(\S|\S[\s\S]*\S)\s*$/g;
var REGEX_GROUP_JSDOC = /^[.]?([\w]+)\s+(\S|\S[\s\S]*\S)\s*$/g;
var REGEX_REQUIRE = /^(\s+)?require\((\'@?[a-zA-Z0-9.\/_-]+\'|\"@?[a-zA-Z0-9.\/_-]+\")\)(\.([a-zA-Z0-9_$]+))?(\s+|$)/;
var NUMERIC_INDEX_PATTERN = "^[0-9]+$";
function getDefaultArgs() {
    return {
        ref: true,
        aliasRef: false,
        topRef: false,
        titles: false,
        defaultProps: false,
        noExtraProps: false,
        propOrder: false,
        typeOfKeyword: false,
        required: false,
        strictNullChecks: false,
        esModuleInterop: false,
        ignoreErrors: false,
        out: "",
        validationKeywords: [],
        include: [],
        excludePrivate: false,
        uniqueNames: false,
        rejectDateType: false,
        id: "",
        defaultNumberType: "number",
        tsNodeRegister: false,
    };
}
exports.getDefaultArgs = getDefaultArgs;
function extend(target) {
    var _ = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _[_i - 1] = arguments[_i];
    }
    if (target == null) {
        throw new TypeError("Cannot convert undefined or null to object");
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
            for (var nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    to[nextKey] = nextSource[nextKey];
                }
            }
        }
    }
    return to;
}
function unique(arr) {
    var temp = {};
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var e = arr_1[_i];
        temp[e] = true;
    }
    var r = [];
    for (var k in temp) {
        if (Object.prototype.hasOwnProperty.call(temp, k)) {
            r.push(k);
        }
    }
    return r;
}
function resolveRequiredFile(symbol, key, fileName, objectName) {
    var sourceFile = getSourceFile(symbol);
    var requiredFilePath = /^[.\/]+/.test(fileName)
        ? fileName === "."
            ? path.resolve(sourceFile.fileName)
            : path.resolve(path.dirname(sourceFile.fileName), fileName)
        : fileName;
    var requiredFile = require(requiredFilePath);
    if (!requiredFile) {
        throw Error("Required: File couldn't be loaded");
    }
    var requiredObject = objectName ? requiredFile[objectName] : requiredFile.default;
    if (requiredObject === undefined) {
        throw Error("Required: Variable is undefined");
    }
    if (typeof requiredObject === "function") {
        throw Error("Required: Can't use function as a variable");
    }
    if (key === "examples" && !Array.isArray(requiredObject)) {
        throw Error("Required: Variable isn't an array");
    }
    return requiredObject;
}
function regexRequire(value) {
    return REGEX_REQUIRE.exec(value);
}
exports.regexRequire = regexRequire;
function parseValue(symbol, key, value) {
    var match = regexRequire(value);
    if (match) {
        var fileName = match[2].substr(1, match[2].length - 2).trim();
        var objectName = match[4];
        return resolveRequiredFile(symbol, key, fileName, objectName);
    }
    try {
        return JSON.parse(value);
    }
    catch (error) {
        return value;
    }
}
function extractLiteralValue(typ) {
    var str = typ.value;
    if (str === undefined) {
        str = typ.text;
    }
    if (typ.flags & ts.TypeFlags.StringLiteral) {
        return str;
    }
    else if (typ.flags & ts.TypeFlags.BooleanLiteral) {
        return typ.intrinsicName === "true";
    }
    else if (typ.flags & ts.TypeFlags.EnumLiteral) {
        var num = parseFloat(str);
        return isNaN(num) ? str : num;
    }
    else if (typ.flags & ts.TypeFlags.NumberLiteral) {
        return parseFloat(str);
    }
    return undefined;
}
function resolveTupleType(propertyType) {
    if (!propertyType.getSymbol() &&
        propertyType.getFlags() & ts.TypeFlags.Object &&
        propertyType.objectFlags & ts.ObjectFlags.Reference) {
        return propertyType.target;
    }
    if (!(propertyType.getFlags() & ts.TypeFlags.Object &&
        propertyType.objectFlags & ts.ObjectFlags.Tuple)) {
        return null;
    }
    return propertyType;
}
var simpleTypesAllowedProperties = {
    type: true,
    description: true,
};
function addSimpleType(def, type) {
    for (var k in def) {
        if (!simpleTypesAllowedProperties[k]) {
            return false;
        }
    }
    if (!def.type) {
        def.type = type;
    }
    else if (typeof def.type !== "string") {
        if (!def.type.every(function (val) {
            return typeof val === "string";
        })) {
            return false;
        }
        if (def.type.indexOf("null") === -1) {
            def.type.push("null");
        }
    }
    else {
        if (typeof def.type !== "string") {
            return false;
        }
        if (def.type !== "null") {
            def.type = [def.type, "null"];
        }
    }
    return true;
}
function makeNullable(def) {
    if (!addSimpleType(def, "null")) {
        var union = def.oneOf || def.anyOf;
        if (union) {
            union.push({ type: "null" });
        }
        else {
            var subdef = {};
            for (var k in def) {
                if (def.hasOwnProperty(k)) {
                    subdef[k] = def[k];
                    delete def[k];
                }
            }
            def.anyOf = [subdef, { type: "null" }];
        }
    }
    return def;
}
function getCanonicalDeclaration(sym) {
    var _a, _b, _c;
    if (sym.valueDeclaration !== undefined) {
        return sym.valueDeclaration;
    }
    else if (((_a = sym.declarations) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        return sym.declarations[0];
    }
    var declarationCount = (_c = (_b = sym.declarations) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    throw new Error("Symbol \"".concat(sym.name, "\" has no valueDeclaration and ").concat(declarationCount, " declarations."));
}
function getSourceFile(sym) {
    var currentDecl = getCanonicalDeclaration(sym);
    while (currentDecl.kind !== ts.SyntaxKind.SourceFile) {
        if (currentDecl.parent === undefined) {
            throw new Error("Unable to locate source file for declaration \"".concat(sym.name, "\"."));
        }
        currentDecl = currentDecl.parent;
    }
    return currentDecl;
}
var validationKeywords = {
    multipleOf: true,
    maximum: true,
    exclusiveMaximum: true,
    minimum: true,
    exclusiveMinimum: true,
    maxLength: true,
    minLength: true,
    pattern: true,
    items: true,
    maxItems: true,
    minItems: true,
    uniqueItems: true,
    contains: true,
    maxProperties: true,
    minProperties: true,
    additionalProperties: true,
    enum: true,
    type: true,
    examples: true,
    ignore: true,
    description: true,
    format: true,
    default: true,
    $ref: true,
    id: true,
    $id: true,
    title: true
};
var annotationKeywords = {
    description: true,
    default: true,
    examples: true,
    $ref: true,
};
var subDefinitions = {
    items: true,
    additionalProperties: true,
    contains: true,
};
var JsonSchemaGenerator = (function () {
    function JsonSchemaGenerator(symbols, allSymbols, userSymbols, inheritingTypes, tc, args) {
        if (args === void 0) { args = getDefaultArgs(); }
        this.args = args;
        this.ignoreDocs = {};
        this.reffedDefinitions = {};
        this.schemaOverrides = new Map();
        this.typeNamesById = {};
        this.typeIdsByName = {};
        this.recursiveTypeRef = new Map();
        this.symbols = symbols;
        this.allSymbols = allSymbols;
        this.userSymbols = userSymbols;
        this.inheritingTypes = inheritingTypes;
        this.tc = tc;
        this.userValidationKeywords = args.validationKeywords.reduce(function (acc, word) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[word] = true, _a)));
        }, {});
    }
    Object.defineProperty(JsonSchemaGenerator.prototype, "ReffedDefinitions", {
        get: function () {
            return this.reffedDefinitions;
        },
        enumerable: false,
        configurable: true
    });
    JsonSchemaGenerator.prototype.isFromDefaultLib = function (symbol) {
        var declarations = symbol.getDeclarations();
        if (declarations && declarations.length > 0) {
            return declarations[0].parent.getSourceFile().hasNoDefaultLib;
        }
        return false;
    };
    JsonSchemaGenerator.prototype.resetSchemaSpecificProperties = function () {
        var _this = this;
        this.reffedDefinitions = {};
        this.typeIdsByName = {};
        this.typeNamesById = {};
        this.schemaOverrides.forEach(function (value, key) {
            _this.reffedDefinitions[key] = value;
        });
    };
    JsonSchemaGenerator.prototype.getDocsBySymbol = function (symbol) {
        var jsDocs = symbol.getJsDocTags();
        return jsDocs.map(function (doc) {
            var name = doc.name;
            var originalText = doc.text ? doc.text.map(function (t) { return t.text; }).join("") : "";
            var text = originalText;
            if (name.startsWith("TJS-")) {
                name = name.slice(4);
                if (!text) {
                    text = "true";
                }
            }
            else if (name === "TJS" && text.startsWith("-")) {
                var match = new RegExp(REGEX_TJS_JSDOC).exec(originalText);
                if (match) {
                    name = match[1];
                    text = match[2];
                }
                else {
                    name = text.replace(/^[\s\-]+/, "");
                    text = "true";
                }
            }
            return { doc: doc, name: name, text: text };
        });
    };
    JsonSchemaGenerator.prototype.parseCommentsIntoDefinition = function (symbol, definition, otherAnnotations) {
        var _this = this;
        if (!symbol) {
            return;
        }
        if (!this.isFromDefaultLib(symbol)) {
            var comments = symbol.getDocumentationComment(this.tc);
            if (comments.length) {
                definition.description = comments
                    .map(function (comment) {
                    return comment.kind === "lineBreak" ? comment.text : comment.text.trim().replace(/\r\n/g, "\n");
                })
                    .join("");
            }
        }
        var jsdocs = this.getDocsBySymbol(symbol);
        var self = this;
        jsdocs.forEach(function (_a) {
            var _b, _c;
            var doc = _a.doc, name = _a.name, text = _a.text;
            var text1;
            try {
                text1 = JSON.parse(text);
            }
            catch (_d) {
                text1 = text;
            }
            var relevantValues = self.ignoreDocs[name] || self.ignoreDocs["*"];
            if (relevantValues &&
                (relevantValues.includes(text1) || relevantValues.includes("*"))) {
                return;
            }
            if (subDefinitions[name]) {
                var match = new RegExp(REGEX_GROUP_JSDOC).exec(text);
                if (match) {
                    var k = match[1];
                    var v = match[2];
                    definition[name] = __assign(__assign({}, definition[name]), (_b = {}, _b[k] = v ? parseValue(symbol, k, v) : true, _b));
                    return;
                }
            }
            if (name.includes(".")) {
                var parts = name.split(".");
                if (parts.length === 2 && subDefinitions[parts[0]]) {
                    definition[parts[0]] = __assign(__assign({}, definition[parts[0]]), (_c = {}, _c[parts[1]] = text ? parseValue(symbol, name, text) : true, _c));
                }
            }
            if (validationKeywords[name] || _this.userValidationKeywords[name]) {
                definition[name] = text === undefined ? "" : parseValue(symbol, name, text);
            }
            else {
                otherAnnotations[doc.name] = true;
            }
        });
    };
    JsonSchemaGenerator.prototype.getDefinitionForRootType = function (propertyType, reffedType, definition, defaultNumberType) {
        var _a;
        var _this = this;
        if (defaultNumberType === void 0) { defaultNumberType = this.args.defaultNumberType; }
        var tupleType = resolveTupleType(propertyType);
        if (tupleType) {
            var elemTypes = propertyType.typeArguments;
            var fixedTypes = elemTypes.map(function (elType) { return _this.getTypeDefinition(elType); });
            definition.type = "array";
            definition.items = fixedTypes;
            var targetTupleType = propertyType.target;
            definition.minItems = targetTupleType.minLength;
            if (targetTupleType.hasRestElement) {
                definition.additionalItems = fixedTypes[fixedTypes.length - 1];
                fixedTypes.splice(fixedTypes.length - 1, 1);
            }
            else {
                definition.maxItems = targetTupleType.fixedLength;
            }
        }
        else {
            var propertyTypeString = this.tc.typeToString(propertyType, undefined, ts.TypeFormatFlags.UseFullyQualifiedType);
            var flags = propertyType.flags;
            var arrayType = this.tc.getIndexTypeOfType(propertyType, ts.IndexKind.Number);
            if (flags & ts.TypeFlags.String) {
                definition.type = "string";
            }
            else if (flags & ts.TypeFlags.Number) {
                var isInteger = definition.type === "integer" ||
                    (reffedType === null || reffedType === void 0 ? void 0 : reffedType.getName()) === "integer" ||
                    defaultNumberType === "integer";
                definition.type = isInteger ? "integer" : "number";
            }
            else if (flags & ts.TypeFlags.Boolean) {
                definition.type = "boolean";
            }
            else if (flags & ts.TypeFlags.Null) {
                definition.type = "null";
            }
            else if (flags & ts.TypeFlags.Undefined || propertyTypeString === "void") {
                definition.type = "undefined";
            }
            else if (flags & ts.TypeFlags.Any || flags & ts.TypeFlags.Unknown) {
            }
            else if (propertyTypeString === "Date" && !this.args.rejectDateType) {
                definition.type = "string";
                definition.format = definition.format || "date-time";
            }
            else if (propertyTypeString === "object") {
                definition.type = "object";
                definition.properties = {};
                definition.additionalProperties = true;
            }
            else {
                var value = extractLiteralValue(propertyType);
                if (value !== undefined) {
                    definition.type = typeof value;
                    definition.enum = [value];
                }
                else if (arrayType !== undefined) {
                    if (propertyType.flags & ts.TypeFlags.Object &&
                        propertyType.objectFlags &
                            (ts.ObjectFlags.Anonymous | ts.ObjectFlags.Interface | ts.ObjectFlags.Mapped)) {
                        definition.type = "object";
                        definition.additionalProperties = false;
                        definition.patternProperties = (_a = {},
                            _a[NUMERIC_INDEX_PATTERN] = this.getTypeDefinition(arrayType),
                            _a);
                    }
                    else {
                        definition.type = "array";
                        if (!definition.items) {
                            definition.items = this.getTypeDefinition(arrayType);
                        }
                    }
                }
                else {
                    var error = new TypeError("Unsupported type: " + propertyTypeString);
                    error.type = propertyType;
                    throw error;
                }
            }
        }
        return definition;
    };
    JsonSchemaGenerator.prototype.getReferencedTypeSymbol = function (prop) {
        var decl = prop.getDeclarations();
        if (decl === null || decl === void 0 ? void 0 : decl.length) {
            var type = decl[0].type;
            if (type && type.kind & ts.SyntaxKind.TypeReference && type.typeName) {
                var symbol = this.tc.getSymbolAtLocation(type.typeName);
                if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
                    return this.tc.getAliasedSymbol(symbol);
                }
                return symbol;
            }
        }
        return undefined;
    };
    JsonSchemaGenerator.prototype.getDefinitionForProperty = function (prop, node) {
        if (prop.flags & ts.SymbolFlags.Method) {
            return null;
        }
        var propertyName = prop.getName();
        var propertyType = this.tc.getTypeOfSymbolAtLocation(prop, node);
        var reffedType = this.getReferencedTypeSymbol(prop);
        var definition = this.getTypeDefinition(propertyType, undefined, undefined, prop, reffedType);
        if (this.args.titles) {
            definition.title = propertyName;
        }
        if (definition.hasOwnProperty("ignore")) {
            return null;
        }
        var valDecl = prop.valueDeclaration;
        if (valDecl === null || valDecl === void 0 ? void 0 : valDecl.initializer) {
            var initial = valDecl.initializer;
            while (ts.isTypeAssertion(initial)) {
                initial = initial.expression;
            }
            if (initial.expression) {
                console.warn("initializer is expression for property " + propertyName);
            }
            else if (initial.kind && initial.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
                definition.default = initial.getText();
            }
            else {
                try {
                    var sandbox = { sandboxvar: null };
                    vm.runInNewContext("sandboxvar=" + initial.getText(), sandbox);
                    var val = sandbox.sandboxvar;
                    if (val === null ||
                        typeof val === "string" ||
                        typeof val === "number" ||
                        typeof val === "boolean" ||
                        Object.prototype.toString.call(val) === "[object Array]") {
                        definition.default = val;
                    }
                    else if (val) {
                        console.warn("unknown initializer for property " + propertyName + ": " + val);
                    }
                }
                catch (e) {
                    console.warn("exception evaluating initializer for property " + propertyName);
                }
            }
        }
        return definition;
    };
    JsonSchemaGenerator.prototype.getEnumDefinition = function (clazzType, definition) {
        var _this = this;
        var node = clazzType.getSymbol().getDeclarations()[0];
        var fullName = this.tc.typeToString(clazzType, undefined, ts.TypeFormatFlags.UseFullyQualifiedType);
        var members = node.kind === ts.SyntaxKind.EnumDeclaration
            ? node.members
            : ts.createNodeArray([node]);
        var enumValues = [];
        var enumTypes = [];
        var addType = function (type) {
            if (enumTypes.indexOf(type) === -1) {
                enumTypes.push(type);
            }
        };
        members.forEach(function (member) {
            var caseLabel = member.name.text;
            var constantValue = _this.tc.getConstantValue(member);
            if (constantValue !== undefined) {
                enumValues.push(constantValue);
                addType(typeof constantValue);
            }
            else {
                var initial = member.initializer;
                if (initial) {
                    if (initial.expression) {
                        var exp = initial.expression;
                        var text = exp.text;
                        if (text) {
                            enumValues.push(text);
                            addType("string");
                        }
                        else if (exp.kind === ts.SyntaxKind.TrueKeyword || exp.kind === ts.SyntaxKind.FalseKeyword) {
                            enumValues.push(exp.kind === ts.SyntaxKind.TrueKeyword);
                            addType("boolean");
                        }
                        else {
                            console.warn("initializer is expression for enum: " + fullName + "." + caseLabel);
                        }
                    }
                    else if (initial.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
                        enumValues.push(initial.getText());
                        addType("string");
                    }
                    else if (initial.kind === ts.SyntaxKind.NullKeyword) {
                        enumValues.push(null);
                        addType("null");
                    }
                }
            }
        });
        if (enumTypes.length) {
            definition.type = enumTypes.length === 1 ? enumTypes[0] : enumTypes;
        }
        if (enumValues.length > 0) {
            definition.enum = enumValues.sort();
        }
        return definition;
    };
    JsonSchemaGenerator.prototype.getUnionDefinition = function (unionType, prop, unionModifier, definition) {
        var enumValues = [];
        var simpleTypes = [];
        var schemas = [];
        var pushSimpleType = function (type) {
            if (simpleTypes.indexOf(type) === -1) {
                simpleTypes.push(type);
            }
        };
        var pushEnumValue = function (val) {
            if (enumValues.indexOf(val) === -1) {
                enumValues.push(val);
            }
        };
        for (var _i = 0, _a = unionType.types; _i < _a.length; _i++) {
            var valueType = _a[_i];
            var value = extractLiteralValue(valueType);
            if (value !== undefined) {
                pushEnumValue(value);
            }
            else {
                var def = this.getTypeDefinition(valueType);
                if (def.type === "undefined") {
                    if (prop) {
                        prop.mayBeUndefined = true;
                    }
                }
                else {
                    var keys = Object.keys(def);
                    if (keys.length === 1 && keys[0] === "type") {
                        if (typeof def.type !== "string") {
                            console.error("Expected only a simple type.");
                        }
                        else {
                            pushSimpleType(def.type);
                        }
                    }
                    else {
                        schemas.push(def);
                    }
                }
            }
        }
        if (enumValues.length > 0) {
            var isOnlyBooleans = enumValues.length === 2 &&
                typeof enumValues[0] === "boolean" &&
                typeof enumValues[1] === "boolean" &&
                enumValues[0] !== enumValues[1];
            if (isOnlyBooleans) {
                pushSimpleType("boolean");
            }
            else {
                var enumSchema = { enum: enumValues.sort() };
                if (enumValues.every(function (x) {
                    return typeof x === "string";
                })) {
                    enumSchema.type = "string";
                }
                else if (enumValues.every(function (x) {
                    return typeof x === "number";
                })) {
                    enumSchema.type = "number";
                }
                else if (enumValues.every(function (x) {
                    return typeof x === "boolean";
                })) {
                    enumSchema.type = "boolean";
                }
                schemas.push(enumSchema);
            }
        }
        if (simpleTypes.length > 0) {
            schemas.push({ type: simpleTypes.length === 1 ? simpleTypes[0] : simpleTypes });
        }
        if (schemas.length === 1) {
            for (var k in schemas[0]) {
                if (schemas[0].hasOwnProperty(k)) {
                    definition[k] = schemas[0][k];
                }
            }
        }
        else {
            definition[unionModifier] = schemas;
        }
        return definition;
    };
    JsonSchemaGenerator.prototype.getIntersectionDefinition = function (intersectionType, definition) {
        var simpleTypes = [];
        var schemas = [];
        var pushSimpleType = function (type) {
            if (simpleTypes.indexOf(type) === -1) {
                simpleTypes.push(type);
            }
        };
        for (var _i = 0, _a = intersectionType.types; _i < _a.length; _i++) {
            var intersectionMember = _a[_i];
            var def = this.getTypeDefinition(intersectionMember);
            if (def.type === "undefined") {
                console.error("Undefined in intersection makes no sense.");
            }
            else {
                var keys = Object.keys(def);
                if (keys.length === 1 && keys[0] === "type") {
                    if (typeof def.type !== "string") {
                        console.error("Expected only a simple type.");
                    }
                    else {
                        pushSimpleType(def.type);
                    }
                }
                else {
                    schemas.push(def);
                }
            }
        }
        if (simpleTypes.length > 0) {
            schemas.push({ type: simpleTypes.length === 1 ? simpleTypes[0] : simpleTypes });
        }
        if (schemas.length === 1) {
            for (var k in schemas[0]) {
                if (schemas[0].hasOwnProperty(k)) {
                    definition[k] = schemas[0][k];
                }
            }
        }
        else {
            definition.allOf = schemas;
        }
        return definition;
    };
    JsonSchemaGenerator.prototype.buildIgnoresDocs = function (typ) {
        var _this = this;
        while (typ.aliasSymbol &&
            (typ.aliasSymbol.escapedName === "Readonly" || typ.aliasSymbol.escapedName === "Mutable") &&
            typ.aliasTypeArguments &&
            typ.aliasTypeArguments[0]) {
            typ = typ.aliasTypeArguments[0];
        }
        if (!typ.aliasSymbol) {
            return;
        }
        var jsDocs = this.getDocsBySymbol(typ.aliasSymbol);
        var ignores = jsDocs.filter(function (d) { return "ignoreDocs" === d.name; });
        if (!ignores.length)
            return;
        ignores.forEach(function (_a) {
            var text = _a.text;
            text = text.trim().replace(/\s*(?=\s)/g, "");
            var key = text.split(/\s?:\s?/)[0];
            var values = text.split(/\s?:\s?/)[1].split(/\s/g).map(function (v) {
                try {
                    return JSON.parse(v);
                }
                catch (_a) {
                    return v;
                }
            });
            _this.ignoreDocs[key] = values;
        });
    };
    JsonSchemaGenerator.prototype.getClassDefinition = function (clazzType, definition) {
        var _this = this;
        var node = clazzType.getSymbol().getDeclarations()[0];
        if (!node) {
            definition.type = "object";
            return definition;
        }
        if (this.args.typeOfKeyword && node.kind === ts.SyntaxKind.FunctionType) {
            definition.typeof = "function";
            return definition;
        }
        var clazz = node;
        var props = this.tc.getPropertiesOfType(clazzType).filter(function (prop) {
            var propertyType = _this.tc.getTypeOfSymbolAtLocation(prop, node);
            if (ts.TypeFlags.Never === propertyType.getFlags()) {
                return false;
            }
            if (!_this.args.excludePrivate) {
                return true;
            }
            var decls = prop.declarations;
            return !(decls &&
                decls.filter(function (decl) {
                    var mods = decl.modifiers;
                    return mods && mods.filter(function (mod) { return mod.kind === ts.SyntaxKind.PrivateKeyword; }).length > 0;
                }).length > 0);
        });
        var fullName = this.tc.typeToString(clazzType, undefined, ts.TypeFormatFlags.UseFullyQualifiedType);
        var modifierFlags = ts.getCombinedModifierFlags(node);
        if (modifierFlags & ts.ModifierFlags.Abstract && this.inheritingTypes[fullName]) {
            var oneOf = this.inheritingTypes[fullName].map(function (typename) {
                return _this.getTypeDefinition(_this.allSymbols[typename]);
            });
            definition.oneOf = oneOf;
        }
        else {
            if (clazz.members) {
                var indexSignatures = clazz.members == null ? [] : clazz.members.filter(function (x) { return x.kind === ts.SyntaxKind.IndexSignature; });
                if (indexSignatures.length === 1) {
                    var indexSignature = indexSignatures[0];
                    if (indexSignature.parameters.length !== 1) {
                        throw new Error("Not supported: IndexSignatureDeclaration parameters.length != 1");
                    }
                    var indexSymbol = indexSignature.parameters[0].symbol;
                    var indexType = this.tc.getTypeOfSymbolAtLocation(indexSymbol, node);
                    var isStringIndexed = indexType.flags === ts.TypeFlags.String;
                    if (indexType.flags !== ts.TypeFlags.Number && !isStringIndexed) {
                        throw new Error("Not supported: IndexSignatureDeclaration with index symbol other than a number or a string");
                    }
                    var typ = this.tc.getTypeAtLocation(indexSignature.type);
                    var def = this.getTypeDefinition(typ, undefined, "anyOf");
                    if (isStringIndexed) {
                        definition.type = "object";
                        definition.additionalProperties = def;
                    }
                    else {
                        definition.type = "array";
                        if (!definition.items) {
                            definition.items = def;
                        }
                    }
                }
            }
            var propertyDefinitions = props.reduce(function (all, prop) {
                var propertyName = prop.getName();
                var propDef = _this.getDefinitionForProperty(prop, node);
                if (propDef != null) {
                    all[propertyName] = propDef;
                }
                return all;
            }, {});
            if (definition.type === undefined) {
                definition.type = "object";
            }
            if (definition.type === "object" && Object.keys(propertyDefinitions).length > 0) {
                definition.properties = propertyDefinitions;
            }
            if (this.args.defaultProps) {
                definition.defaultProperties = [];
            }
            if (this.args.noExtraProps && definition.additionalProperties === undefined) {
                definition.additionalProperties = false;
            }
            if (this.args.propOrder) {
                var propertyOrder = props.reduce(function (order, prop) {
                    order.push(prop.getName());
                    return order;
                }, []);
                definition.propertyOrder = propertyOrder;
            }
            if (this.args.required) {
                var requiredProps = props.reduce(function (required, prop) {
                    var def = {};
                    _this.parseCommentsIntoDefinition(prop, def, {});
                    if (!(prop.flags & ts.SymbolFlags.Optional) &&
                        !(prop.flags & ts.SymbolFlags.Method) &&
                        !prop.mayBeUndefined &&
                        !def.hasOwnProperty("ignore")) {
                        required.push(prop.getName());
                    }
                    return required;
                }, []);
                if (requiredProps.length > 0) {
                    definition.required = unique(requiredProps).sort();
                }
            }
        }
        return definition;
    };
    JsonSchemaGenerator.prototype.getTypeName = function (typ) {
        var id = typ.id;
        if (this.typeNamesById[id]) {
            return this.typeNamesById[id];
        }
        return this.makeTypeNameUnique(typ, this.tc
            .typeToString(typ, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType)
            .replace(REGEX_FILE_NAME_OR_SPACE, ""));
    };
    JsonSchemaGenerator.prototype.makeTypeNameUnique = function (typ, baseName) {
        var id = typ.id;
        var name = baseName;
        for (var i = 1; this.typeIdsByName[name] !== undefined && this.typeIdsByName[name] !== id; ++i) {
            name = baseName + "_" + i;
        }
        this.typeNamesById[id] = name;
        this.typeIdsByName[name] = id;
        return name;
    };
    JsonSchemaGenerator.prototype.getTypeDefinition = function (typ, asRef, unionModifier, prop, reffedType, pairedSymbol) {
        if (asRef === void 0) { asRef = this.args.ref; }
        if (unionModifier === void 0) { unionModifier = "anyOf"; }
        var definition = {};
        while (typ.aliasSymbol &&
            (typ.aliasSymbol.escapedName === "Readonly" || typ.aliasSymbol.escapedName === "Mutable") &&
            typ.aliasTypeArguments &&
            typ.aliasTypeArguments[0]) {
            typ = typ.aliasTypeArguments[0];
            reffedType = undefined;
        }
        if (this.args.typeOfKeyword &&
            typ.flags & ts.TypeFlags.Object &&
            typ.objectFlags & ts.ObjectFlags.Anonymous) {
            definition.typeof = "function";
            return definition;
        }
        var returnedDefinition = definition;
        if (prop) {
            var defs = {};
            var others = {};
            this.parseCommentsIntoDefinition(prop, defs, others);
            if (defs.hasOwnProperty("ignore")) {
                return defs;
            }
        }
        var symbol = typ.getSymbol();
        var isRawType = !symbol ||
            (this.tc.getFullyQualifiedName(symbol) !== "Window" &&
                (this.tc.getFullyQualifiedName(symbol) === "Date" ||
                    symbol.name === "integer" ||
                    this.tc.getIndexInfoOfType(typ, ts.IndexKind.Number) !== undefined));
        var isStringEnum = false;
        if (typ.flags & ts.TypeFlags.Union) {
            var unionType = typ;
            isStringEnum = unionType.types.every(function (propType) {
                return (propType.getFlags() & ts.TypeFlags.StringLiteral) !== 0;
            });
        }
        var asTypeAliasRef = asRef && reffedType && (this.args.aliasRef || isStringEnum);
        if (!asTypeAliasRef) {
            if (isRawType ||
                (typ.getFlags() & ts.TypeFlags.Object && typ.objectFlags & ts.ObjectFlags.Anonymous)) {
                asRef = false;
            }
        }
        var fullTypeName = "";
        if (asTypeAliasRef) {
            var typeName = this.tc
                .getFullyQualifiedName(reffedType.getFlags() & ts.SymbolFlags.Alias ? this.tc.getAliasedSymbol(reffedType) : reffedType)
                .replace(REGEX_FILE_NAME_OR_SPACE, "");
            if (this.args.uniqueNames && reffedType) {
                var sourceFile = getSourceFile(reffedType);
                var relativePath = path.relative(process.cwd(), sourceFile.fileName);
                fullTypeName = "".concat(typeName, ".").concat(generateHashOfNode(getCanonicalDeclaration(reffedType), relativePath));
            }
            else {
                fullTypeName = this.makeTypeNameUnique(typ, typeName);
            }
        }
        else {
            if (this.args.uniqueNames && typ.symbol) {
                var sym = typ.symbol;
                var sourceFile = getSourceFile(sym);
                var relativePath = path.relative(process.cwd(), sourceFile.fileName);
                fullTypeName = "".concat(this.getTypeName(typ), ".").concat(generateHashOfNode(getCanonicalDeclaration(sym), relativePath));
            }
            else if (reffedType && this.schemaOverrides.has(reffedType.escapedName)) {
                fullTypeName = reffedType.escapedName;
            }
            else {
                fullTypeName = this.getTypeName(typ);
            }
        }
        if (!isRawType || !!typ.aliasSymbol) {
            if (this.recursiveTypeRef.has(fullTypeName)) {
                asRef = true;
            }
            else {
                this.recursiveTypeRef.set(fullTypeName, definition);
            }
        }
        if (asRef) {
            returnedDefinition = {
                $ref: "".concat(this.args.id, "#/definitions/") + fullTypeName,
            };
        }
        var otherAnnotations = {};
        this.parseCommentsIntoDefinition(reffedType, definition, otherAnnotations);
        this.parseCommentsIntoDefinition(symbol, definition, otherAnnotations);
        this.parseCommentsIntoDefinition(typ.aliasSymbol, definition, otherAnnotations);
        if (prop) {
            this.parseCommentsIntoDefinition(prop, returnedDefinition, otherAnnotations);
        }
        if (pairedSymbol && symbol && this.isFromDefaultLib(symbol)) {
            this.parseCommentsIntoDefinition(pairedSymbol, definition, otherAnnotations);
        }
        if (!asRef || !this.reffedDefinitions[fullTypeName]) {
            if (asRef) {
                var reffedDefinition = void 0;
                if (asTypeAliasRef && reffedType && typ.symbol !== reffedType && symbol) {
                    reffedDefinition = this.getTypeDefinition(typ, true, undefined, symbol, symbol);
                }
                else {
                    reffedDefinition = definition;
                }
                this.reffedDefinitions[fullTypeName] = reffedDefinition;
                if (this.args.titles && fullTypeName) {
                    definition.title = fullTypeName;
                }
            }
            var node = (symbol === null || symbol === void 0 ? void 0 : symbol.getDeclarations()) !== undefined ? symbol.getDeclarations()[0] : null;
            if (definition.type === undefined) {
                if (typ.flags & ts.TypeFlags.Union) {
                    this.getUnionDefinition(typ, prop, unionModifier, definition);
                }
                else if (typ.flags & ts.TypeFlags.Intersection) {
                    if (this.args.noExtraProps) {
                        if (this.args.noExtraProps) {
                            definition.additionalProperties = false;
                        }
                        var types = typ.types;
                        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
                            var member = types_1[_i];
                            var other = this.getTypeDefinition(member, false);
                            definition.type = other.type;
                            definition.properties = __assign(__assign({}, definition.properties), other.properties);
                            if (Object.keys(other.default || {}).length > 0) {
                                definition.default = extend(definition.default || {}, other.default);
                            }
                            if (other.required) {
                                definition.required = unique((definition.required || []).concat(other.required)).sort();
                            }
                        }
                    }
                    else {
                        this.getIntersectionDefinition(typ, definition);
                    }
                }
                else if (isRawType) {
                    if (pairedSymbol) {
                        this.parseCommentsIntoDefinition(pairedSymbol, definition, {});
                    }
                    this.getDefinitionForRootType(typ, reffedType, definition);
                }
                else if (node &&
                    (node.kind === ts.SyntaxKind.EnumDeclaration || node.kind === ts.SyntaxKind.EnumMember)) {
                    this.getEnumDefinition(typ, definition);
                }
                else if (symbol &&
                    symbol.flags & ts.SymbolFlags.TypeLiteral &&
                    symbol.members.size === 0 &&
                    !(node && node.kind === ts.SyntaxKind.MappedType)) {
                    definition.type = "object";
                    definition.properties = {};
                }
                else {
                    this.getClassDefinition(typ, definition);
                }
            }
        }
        if (this.recursiveTypeRef.get(fullTypeName) === definition) {
            this.recursiveTypeRef.delete(fullTypeName);
            if (this.reffedDefinitions[fullTypeName]) {
                var annotations = Object.entries(returnedDefinition).reduce(function (acc, _a) {
                    var key = _a[0], value = _a[1];
                    if (annotationKeywords[key] && typeof value !== undefined) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                returnedDefinition = __assign({ $ref: "".concat(this.args.id, "#/definitions/") + fullTypeName }, annotations);
            }
        }
        if (otherAnnotations["nullable"]) {
            makeNullable(returnedDefinition);
        }
        return returnedDefinition;
    };
    JsonSchemaGenerator.prototype.setSchemaOverride = function (symbolName, schema) {
        this.schemaOverrides.set(symbolName, schema);
    };
    JsonSchemaGenerator.prototype.getSchemaForSymbol = function (symbolName, includeReffedDefinitions) {
        if (includeReffedDefinitions === void 0) { includeReffedDefinitions = true; }
        if (!this.allSymbols[symbolName]) {
            throw new Error("type ".concat(symbolName, " not found"));
        }
        this.resetSchemaSpecificProperties();
        this.buildIgnoresDocs(this.allSymbols[symbolName]);
        var def = this.getTypeDefinition(this.allSymbols[symbolName], this.args.topRef, undefined, undefined, undefined, this.userSymbols[symbolName] || undefined);
        if (this.args.ref && includeReffedDefinitions && Object.keys(this.reffedDefinitions).length > 0) {
            def.definitions = this.reffedDefinitions;
        }
        def["$schema"] = "http://json-schema.org/draft-07/schema#";
        var id = this.args.id;
        if (id) {
            def["$id"] = this.args.id;
        }
        return def;
    };
    JsonSchemaGenerator.prototype.getSchemaForSymbols = function (symbolNames, includeReffedDefinitions) {
        if (includeReffedDefinitions === void 0) { includeReffedDefinitions = true; }
        var root = {
            $schema: "http://json-schema.org/draft-07/schema#",
            definitions: {},
        };
        this.resetSchemaSpecificProperties();
        var id = this.args.id;
        if (id) {
            root["$id"] = id;
        }
        for (var _i = 0, symbolNames_1 = symbolNames; _i < symbolNames_1.length; _i++) {
            var symbolName = symbolNames_1[_i];
            this.buildIgnoresDocs(this.allSymbols[symbolName]);
            root.definitions[symbolName] = this.getTypeDefinition(this.allSymbols[symbolName], this.args.topRef, undefined, undefined, undefined, this.userSymbols[symbolName]);
            this.ignoreDocs = {};
        }
        if (this.args.ref && includeReffedDefinitions && Object.keys(this.reffedDefinitions).length > 0) {
            root.definitions = __assign(__assign({}, root.definitions), this.reffedDefinitions);
        }
        return root;
    };
    JsonSchemaGenerator.prototype.getSymbols = function (name) {
        if (name === void 0) {
            return this.symbols;
        }
        return this.symbols.filter(function (symbol) { return symbol.typeName === name; });
    };
    JsonSchemaGenerator.prototype.getUserSymbols = function () {
        return Object.keys(this.userSymbols);
    };
    JsonSchemaGenerator.prototype.getMainFileSymbols = function (program, onlyIncludeFiles) {
        var _this = this;
        function includeFile(file) {
            if (onlyIncludeFiles === undefined) {
                return !file.isDeclarationFile;
            }
            return onlyIncludeFiles.filter(function (f) { return (0, path_equal_1.pathEqual)(f, file.fileName); }).length > 0;
        }
        var files = program.getSourceFiles().filter(includeFile);
        if (files.length) {
            return Object.keys(this.userSymbols).filter(function (key) {
                var symbol = _this.userSymbols[key];
                if (!symbol || !symbol.declarations || !symbol.declarations.length) {
                    return false;
                }
                var node = symbol.declarations[0];
                while (node === null || node === void 0 ? void 0 : node.parent) {
                    node = node.parent;
                }
                return files.indexOf(node.getSourceFile()) > -1;
            });
        }
        return [];
    };
    return JsonSchemaGenerator;
}());
exports.JsonSchemaGenerator = JsonSchemaGenerator;
function getProgramFromFiles(files, jsonCompilerOptions, basePath) {
    if (jsonCompilerOptions === void 0) { jsonCompilerOptions = {}; }
    if (basePath === void 0) { basePath = "./"; }
    var compilerOptions = ts.convertCompilerOptionsFromJson(jsonCompilerOptions, basePath).options;
    var options = {
        noEmit: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        allowUnusedLabels: true,
    };
    for (var k in compilerOptions) {
        if (compilerOptions.hasOwnProperty(k)) {
            options[k] = compilerOptions[k];
        }
    }
    return ts.createProgram(files, options);
}
exports.getProgramFromFiles = getProgramFromFiles;
function generateHashOfNode(node, relativePath) {
    return (0, crypto_1.createHash)("md5").update(relativePath).update(node.pos.toString()).digest("hex").substring(0, 8);
}
function buildGenerator(program, args, onlyIncludeFiles) {
    if (args === void 0) { args = {}; }
    function isUserFile(file) {
        if (onlyIncludeFiles === undefined) {
            return !file.hasNoDefaultLib;
        }
        return onlyIncludeFiles.indexOf(file.fileName) >= 0;
    }
    var settings = getDefaultArgs();
    for (var pref in args) {
        if (args.hasOwnProperty(pref)) {
            settings[pref] = args[pref];
        }
    }
    if (args.tsNodeRegister) {
        require("ts-node/register");
    }
    var diagnostics = [];
    if (!args.ignoreErrors) {
        diagnostics = ts.getPreEmitDiagnostics(program);
    }
    if (diagnostics.length === 0) {
        var typeChecker_1 = program.getTypeChecker();
        var symbols_1 = [];
        var allSymbols_1 = {};
        var userSymbols_1 = {};
        var inheritingTypes_1 = {};
        var workingDir_1 = program.getCurrentDirectory();
        program.getSourceFiles().forEach(function (sourceFile, _sourceFileIdx) {
            var relativePath = path.relative(workingDir_1, sourceFile.fileName);
            function inspect(node, tc) {
                if (node.kind === ts.SyntaxKind.ClassDeclaration ||
                    node.kind === ts.SyntaxKind.InterfaceDeclaration ||
                    node.kind === ts.SyntaxKind.EnumDeclaration ||
                    node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
                    var symbol = node.symbol;
                    var nodeType = tc.getTypeAtLocation(node);
                    var fullyQualifiedName = tc.getFullyQualifiedName(symbol);
                    var typeName = fullyQualifiedName.replace(/".*"\./, "");
                    var name_1 = !args.uniqueNames ? typeName : "".concat(typeName, ".").concat(generateHashOfNode(node, relativePath));
                    symbols_1.push({ name: name_1, typeName: typeName, fullyQualifiedName: fullyQualifiedName, symbol: symbol });
                    if (!userSymbols_1[name_1]) {
                        allSymbols_1[name_1] = nodeType;
                    }
                    if (isUserFile(sourceFile)) {
                        userSymbols_1[name_1] = symbol;
                    }
                    var baseTypes = nodeType.getBaseTypes() || [];
                    baseTypes.forEach(function (baseType) {
                        var baseName = tc.typeToString(baseType, undefined, ts.TypeFormatFlags.UseFullyQualifiedType);
                        if (!inheritingTypes_1[baseName]) {
                            inheritingTypes_1[baseName] = [];
                        }
                        inheritingTypes_1[baseName].push(name_1);
                    });
                }
                else {
                    ts.forEachChild(node, function (n) { return inspect(n, tc); });
                }
            }
            inspect(sourceFile, typeChecker_1);
        });
        return new JsonSchemaGenerator(symbols_1, allSymbols_1, userSymbols_1, inheritingTypes_1, typeChecker_1, settings);
    }
    else {
        diagnostics.forEach(function (diagnostic) {
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                console.error("".concat(diagnostic.file.fileName, " (").concat(line + 1, ",").concat(character + 1, "): ").concat(message));
            }
            else {
                console.error(message);
            }
        });
        return null;
    }
}
exports.buildGenerator = buildGenerator;
function generateSchema(program, fullTypeName, args, onlyIncludeFiles, externalGenerator) {
    if (args === void 0) { args = {}; }
    var generator = externalGenerator !== null && externalGenerator !== void 0 ? externalGenerator : buildGenerator(program, args, onlyIncludeFiles);
    if (generator === null) {
        return null;
    }
    if (fullTypeName === "*") {
        return generator.getSchemaForSymbols(generator.getMainFileSymbols(program, onlyIncludeFiles));
    }
    else if (args.uniqueNames) {
        var matchingSymbols = generator.getSymbols(fullTypeName);
        if (matchingSymbols.length === 1) {
            return generator.getSchemaForSymbol(matchingSymbols[0].name);
        }
        else {
            throw new Error("".concat(matchingSymbols.length, " definitions found for requested type \"").concat(fullTypeName, "\"."));
        }
    }
    else {
        return generator.getSchemaForSymbol(fullTypeName);
    }
}
exports.generateSchema = generateSchema;
function programFromConfig(configFileName, onlyIncludeFiles) {
    var result = ts.parseConfigFileTextToJson(configFileName, ts.sys.readFile(configFileName));
    var configObject = result.config;
    var configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName), {}, path.basename(configFileName));
    var options = configParseResult.options;
    options.noEmit = true;
    delete options.out;
    delete options.outDir;
    delete options.outFile;
    delete options.declaration;
    delete options.declarationDir;
    delete options.declarationMap;
    var program = ts.createProgram({
        rootNames: onlyIncludeFiles || configParseResult.fileNames,
        options: options,
        projectReferences: configParseResult.projectReferences,
    });
    return program;
}
exports.programFromConfig = programFromConfig;
function normalizeFileName(fn) {
    while (fn.substr(0, 2) === "./") {
        fn = fn.substr(2);
    }
    return fn;
}
function exec(filePattern, fullTypeName, args) {
    if (args === void 0) { args = getDefaultArgs(); }
    return __awaiter(this, void 0, void 0, function () {
        var program, onlyIncludeFiles, globs, definition, json, hasBeenBuffered;
        var _a;
        return __generator(this, function (_b) {
            onlyIncludeFiles = undefined;
            if (REGEX_TSCONFIG_NAME.test(path.basename(filePattern))) {
                if (args.include && args.include.length > 0) {
                    globs = args.include.map(function (f) { return glob.sync(f); });
                    onlyIncludeFiles = (_a = []).concat.apply(_a, globs).map(normalizeFileName);
                }
                program = programFromConfig(filePattern, onlyIncludeFiles);
            }
            else {
                onlyIncludeFiles = glob.sync(filePattern);
                program = getProgramFromFiles(onlyIncludeFiles, {
                    strictNullChecks: args.strictNullChecks,
                    esModuleInterop: args.esModuleInterop
                });
                onlyIncludeFiles = onlyIncludeFiles.map(normalizeFileName);
            }
            definition = generateSchema(program, fullTypeName, args, onlyIncludeFiles);
            if (definition === null) {
                throw new Error("No output definition. Probably caused by errors prior to this?");
            }
            json = (0, safe_stable_stringify_1.stringify)(definition, null, 4) + "\n\n";
            if (args.out) {
                return [2, new Promise(function (resolve, reject) {
                        var fs = require("fs");
                        fs.mkdir(path.dirname(args.out), { recursive: true }, function (mkErr) {
                            if (mkErr) {
                                return reject(new Error("Unable to create parent directory for output file: " + mkErr.message));
                            }
                            fs.writeFile(args.out, json, function (wrErr) {
                                if (wrErr) {
                                    return reject(new Error("Unable to write output file: " + wrErr.message));
                                }
                                resolve();
                            });
                        });
                    })];
            }
            else {
                hasBeenBuffered = process.stdout.write(json);
                if (hasBeenBuffered) {
                    return [2, new Promise(function (resolve) { return process.stdout.on("drain", function () { return resolve(); }); })];
                }
            }
            return [2];
        });
    });
}
exports.exec = exec;
//# sourceMappingURL=typescript-json-schema.js.map