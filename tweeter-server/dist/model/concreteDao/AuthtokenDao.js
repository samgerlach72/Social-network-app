"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class AuthTokenDAO {
    constructor() {
        this.tableName = "authtoken";
        this.authtokenAttr = "authtoken";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    }
    putAuthtoken(authtoken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.authtokenAttr]: JSON.stringify(authtoken),
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    validateAuthtoken(authtoken) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.authtokenAttr]: JSON.stringify(authtoken)
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            if (output.Item == undefined) {
                throw new Error("[Bad Request] Invalid authtoken");
            }
            else {
                const storedTimestamp = (_a = tweeter_shared_1.AuthToken.fromJson(output.Item[this.authtokenAttr])) === null || _a === void 0 ? void 0 : _a.timestamp;
                const currentTimestamp = Date.now();
                const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
                if (storedTimestamp && (currentTimestamp - storedTimestamp) < twentyFourHoursInMillis) {
                    return true;
                }
                else {
                    throw new Error("[Bad Request] Invalid authtoken");
                }
            }
        });
    }
    deleteAuthtoken(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.authtokenAttr]: authToken,
                },
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
}
exports.AuthTokenDAO = AuthTokenDAO;
