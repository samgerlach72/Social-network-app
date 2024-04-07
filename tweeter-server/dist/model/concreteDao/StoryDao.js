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
exports.StoryDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class StoryDAO {
    constructor() {
        this.tableName = "story";
        this.statusAttr = "status";
        this.senderAliasAttr = "sender_alias";
        this.timestampAttr = "timestamp";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    }
    putStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.statusAttr]: JSON.stringify(status),
                    [this.senderAliasAttr]: status.user.alias,
                    [this.timestampAttr]: Date.now(),
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getPageOfStoryItems(alias, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: `${this.senderAliasAttr} = :sender_alias`,
                ExpressionAttributeValues: {
                    ":sender_alias": alias,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ExclusiveStartKey: lastItem === undefined
                    ? undefined
                    : { [this.statusAttr]: JSON.stringify(lastItem) }
            };
            const { Items, LastEvaluatedKey } = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const statusses = Items ? Items.map(item => tweeter_shared_1.Status.fromJson(item["status"])) : [];
            const hasMorePages = !!LastEvaluatedKey;
            return [statusses, hasMorePages];
        });
    }
}
exports.StoryDAO = StoryDAO;
