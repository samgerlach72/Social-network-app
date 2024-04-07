import { DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status } from "tweeter-shared";
  
export class FeedDAO {
  readonly tableName = "feed";
  readonly statusAttr = "status";
  readonly receiverAliasAttr = "receiver_alias"
  readonly timestampAttr = "timestamp";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

  async putStatus(status: Status, receiverAlias: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.statusAttr]: JSON.stringify(status),
          [this.receiverAliasAttr]: status.user.alias,
          [this.timestampAttr]: status.timestamp,
        },
      };

      await this.client.send(new PutCommand(params));
  }
  
  async getPageOfFeedItems(
    alias: string,
    pageSize: number,
    lastItem: Status | undefined
  ): Promise<[Status[], boolean]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: `${this.receiverAliasAttr} = :receiver_alias`,
      ExpressionAttributeValues: {
        ":receiver_alias": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
      lastItem === undefined
        ? undefined
        : {[this.statusAttr]: JSON.stringify(lastItem)}
    };
  
    const { Items, LastEvaluatedKey } = await this.client.send(new QueryCommand(params));
  
    const statusses: Status[] = Items ? Items.map(item => Status.fromJson(item["status"])!) : [];
    const hasMorePages: boolean = !!LastEvaluatedKey && Items!.length === pageSize; 
    return [statusses, hasMorePages];
  }
} 