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
exports.FollowsDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
class FollowsDAO {
    constructor() {
        this.tableName = "follows";
        this.indexName = "follows_index";
        this.followerHandleAttr = "follower_handle";
        this.followerAttr = "follower";
        this.followeeHandleAttr = "followee_handle";
        this.followeeAttr = "followee";
        this.client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: "us-east-1" }));
    }
    putFollow(follower, followee) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Item: {
                    [this.followerHandleAttr]: follower.alias,
                    [this.followerAttr]: JSON.stringify(follower),
                    [this.followeeHandleAttr]: followee.alias,
                    [this.followeeAttr]: JSON.stringify(followee)
                },
            };
            yield this.client.send(new lib_dynamodb_1.PutCommand(params));
        });
    }
    getIsFollower(followerHandle, followeeHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.followerHandleAttr]: followerHandle,
                    [this.followeeHandleAttr]: followeeHandle,
                },
            };
            const output = yield this.client.send(new lib_dynamodb_1.GetCommand(params));
            return output.Item == undefined
                ? false
                : true;
        });
    }
    // async updateFollowName(followerHandle: string, followeeHandle: string, followerName: string, followeeName: string): Promise<void> {
    //     const params = {
    //       TableName: this.tableName,
    //       Key: {
    //         [this.followerHandleAttr]: followerHandle,
    //         [this.followeeHandleAttr]: followeeHandle
    //       },
    //       UpdateExpression: "SET #fn = :fn, #fen = :fen",
    //       ExpressionAttributeNames: {
    //         "#fn": this.followerNameAttr,
    //         "#fen": this.followeeNameAttr,
    //       },
    //       ExpressionAttributeValues: {
    //         ":fn": followerName,
    //         ":fen": followeeName
    //       },
    //     }; 
    //     await this.client.send(new UpdateCommand(params));
    // }
    deleteFollow(followerHandle, followeeHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.followerHandleAttr]: followerHandle,
                    [this.followeeHandleAttr]: followeeHandle
                },
            };
            yield this.client.send(new lib_dynamodb_1.DeleteCommand(params));
        });
    }
    getPageOfFollowees(followerHandle, pageSize, lastFolloweeHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followerHandleAttr + " = :follower",
                ExpressionAttributeValues: {
                    ":follower": followerHandle,
                },
                TableName: this.tableName,
                Limit: pageSize,
                ExclusiveStartKey: lastFolloweeHandle === undefined
                    ? undefined
                    : {
                        [this.followerHandleAttr]: followerHandle,
                        [this.followeeHandleAttr]: lastFolloweeHandle,
                    },
            };
            const { Items, LastEvaluatedKey } = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const followees = Items ? Items.map(item => tweeter_shared_1.User.fromJson(item["followee"])) : [];
            const hasMorePages = !!LastEvaluatedKey;
            return [followees, hasMorePages];
        });
    }
    getPageOfFollowers(followeeHandle, pageSize, lastFollowerHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: `${this.followeeHandleAttr} = :followee`,
                ExpressionAttributeValues: {
                    ":followee": followeeHandle,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
                Limit: pageSize,
                ExclusiveStartKey: lastFollowerHandle === undefined
                    ? undefined
                    : {
                        [this.followeeHandleAttr]: followeeHandle,
                        [this.followerHandleAttr]: lastFollowerHandle,
                    },
            };
            const { Items, LastEvaluatedKey } = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            const followers = Items ? Items.map(item => tweeter_shared_1.User.fromJson(item["follower"])) : [];
            const hasMorePages = !!LastEvaluatedKey;
            return [followers, hasMorePages];
        });
    }
    getFolloweesCount(followerHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: this.followerHandleAttr + " = :follower",
                ExpressionAttributeValues: {
                    ":follower": followerHandle,
                },
                TableName: this.tableName,
                Select: "COUNT", // Select the count of items
            };
            const { Count } = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            return Count !== null && Count !== void 0 ? Count : 0; // Return the count, or 0 if Count is null or undefined
        });
    }
    getFollowersCount(followeeHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                KeyConditionExpression: `${this.followeeHandleAttr} = :followee`,
                ExpressionAttributeValues: {
                    ":followee": followeeHandle,
                },
                TableName: this.tableName,
                IndexName: this.indexName,
                Select: "COUNT", // Select the count of items
            };
            const { Count } = yield this.client.send(new lib_dynamodb_1.QueryCommand(params));
            return Count !== null && Count !== void 0 ? Count : 0; // Return the count, or 0 if Count is null or undefined
        });
    }
}
exports.FollowsDAO = FollowsDAO;
