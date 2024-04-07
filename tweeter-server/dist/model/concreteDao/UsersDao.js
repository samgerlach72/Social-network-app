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
exports.UsersDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class UsersDAO {
    constructor() {
        this.tableName = "users";
        this.aliasAttr = "alias";
        this.userAttr = "user";
        this.hashedPasswordAttr = "hashedPassword";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
        // async getHashedPassword(user: User): Promise<string | null> {
        //     const params = {
        //         TableName: this.tableName,
        //         Key: {
        //             [this.aliasAttr]: user.alias
        //         },
        //     };
        //     const output = await this.client.send(new GetCommand(params));
        //     return output.Item == undefined
        //         ? null
        //         : output.Item[this.hashedPasswordAttr];
        // }
    }
    putUser(user, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.aliasAttr]: user.alias,
                    [this.userAttr]: JSON.stringify(user),
                    [this.hashedPasswordAttr]: hashedPassword,
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getUser(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.aliasAttr]: alias
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? null
                : [tweeter_shared_1.User.fromJson(output.Item[this.userAttr]), output.Item[this.hashedPasswordAttr]];
        });
    }
}
exports.UsersDAO = UsersDAO;
