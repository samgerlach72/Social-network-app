import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
  
export class UsersDAO {
    readonly tableName = "users";
    readonly aliasAttr = "alias";
    readonly userAttr = "user";
    readonly hashedPasswordAttr = "hashedPassword";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

    async putUser(user: User, hashedPassword: string): Promise<void> {
        if (await this.getUser(user.alias) !== null){
            throw new Error("[Bad Request] User with that alias already exists.")
        }
        const params = {
            TableName: this.tableName,
            Item: {
            [this.aliasAttr]: user.alias,
            [this.userAttr]: JSON.stringify(user),
            [this.hashedPasswordAttr]: hashedPassword,
            },
        };
        await this.client.send(new PutCommand(params));
    }
    
    async getUser(alias: string): Promise<[User, string] | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.aliasAttr]: alias
            },
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? null
            : [User.fromJson(output.Item[this.userAttr])!, output.Item[this.hashedPasswordAttr]]
    }
} 