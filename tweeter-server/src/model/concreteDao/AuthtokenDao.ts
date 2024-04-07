import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
  
export class AuthTokenDAO {
  readonly tableName = "authtoken";
  readonly authtokenAttr = "authtoken";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

  async putAuthtoken(authtoken: AuthToken): Promise<void> {
    
    const params = {
        TableName: this.tableName,
        Item: {
          [this.authtokenAttr]: JSON.stringify(authtoken),
        },
    };
    await this.client.send(new PutCommand(params));
  }
  
  async validateAuthtoken(authtoken: AuthToken): Promise<boolean> {
    const params = {
        TableName: this.tableName,
        Key: {
            [this.authtokenAttr]: JSON.stringify(authtoken)
        },
    };
    const output = await this.client.send(new GetCommand(params));
    if (output.Item == undefined){
        throw new Error("[Bad Request] Invalid authtoken");
    }
    else {
        const storedTimestamp = AuthToken.fromJson(output.Item[this.authtokenAttr])?.timestamp;
        const currentTimestamp = Date.now();
        const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;
        if (storedTimestamp && (currentTimestamp - storedTimestamp) < twentyFourHoursInMillis) {
            return true;
        } else {
            throw new Error("[Bad Request] Invalid authtoken");
        }
    }
  }

  async deleteAuthtoken(authToken: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        [this.authtokenAttr]: authToken,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
} 