import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
  
export class FollowsDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followerAttr = "follower";
  readonly followeeHandleAttr = "followee_handle";
  readonly followeeAttr = "followee";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));

  async putFollow(follower: User, followee: User): Promise<void> {
      const params = {
        TableName: this.tableName,
        Item: {
          [this.followerHandleAttr]: follower.alias,
          [this.followerAttr]: JSON.stringify(follower),
          [this.followeeHandleAttr]: followee.alias,
          [this.followeeAttr]: JSON.stringify(followee)
        },
      };

      await this.client.send(new PutCommand(params));
  }
  
  async getIsFollower(followerHandle: string, followeeHandle: string): Promise<boolean> {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.followerHandleAttr]: followerHandle,
          [this.followeeHandleAttr]: followeeHandle,
        },
      };
      const output = await this.client.send(new GetCommand(params));
      return output.Item == undefined
          ? false
          : true;
  }
  
  async deleteFollow(followerHandle: string, followeeHandle: string): Promise<void> {
      const params = {
        TableName: this.tableName,
        Key: {
          [this.followerHandleAttr]: followerHandle,
          [this.followeeHandleAttr]: followeeHandle
        },
      };
      await this.client.send(new DeleteCommand(params));
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<[User[], boolean]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: this.followerHandleAttr + " = :follower",
      ExpressionAttributeValues: {
        ":follower": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
      lastFolloweeHandle === undefined
        ? undefined
        : {
            [this.followerHandleAttr]: followerHandle,
            [this.followeeHandleAttr]: lastFolloweeHandle,
          },
    };
  
    const { Items, LastEvaluatedKey } = await this.client.send(new QueryCommand(params));
    const followees: User[] = Items ? Items.map(item => User.fromJson(item["followee"])!) : [];
    const hasMorePages: boolean = !!LastEvaluatedKey && Items!.length === pageSize;
    return [followees, hasMorePages];
  }
  
  async getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<[User[], boolean]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: this.followeeHandleAttr + " = :followee",
      ExpressionAttributeValues: {
        ":followee": followeeHandle,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
      lastFollowerHandle === undefined
        ? undefined
        : {
            [this.followeeHandleAttr]: followeeHandle,
            [this.followerHandleAttr]: lastFollowerHandle,
          },
    };
  
    const { Items, LastEvaluatedKey } = await this.client.send(new QueryCommand(params));
    const followers: User[] = Items ? Items.map(item => User.fromJson(item["follower"])!) : [];
    const hasMorePages: boolean = !!LastEvaluatedKey && Items!.length === pageSize;
    return [followers, hasMorePages];
  }

  async getFolloweesCount(followerHandle: string): Promise<number> {
    const params: QueryCommandInput = {
        KeyConditionExpression: this.followerHandleAttr + " = :follower",
        ExpressionAttributeValues: {
            ":follower": followerHandle,
        },
        TableName: this.tableName,
        Select: "COUNT", // Select the count of items
    };

    const { Count } = await this.client.send(new QueryCommand(params));
    return Count ?? 0; // Return the count, or 0 if Count is null or undefined
  }

  async getFollowersCount(followeeHandle: string): Promise<number> {
      const params: QueryCommandInput = {
          KeyConditionExpression: `${this.followeeHandleAttr} = :followee`,
          ExpressionAttributeValues: {
              ":followee": followeeHandle,
          },
          TableName: this.tableName,
          IndexName: this.indexName,
          Select: "COUNT", // Select the count of items
      };

      const { Count } = await this.client.send(new QueryCommand(params));
      return Count ?? 0; // Return the count, or 0 if Count is null or undefined
  }

  async getAllFollowerAliasses(followeeAlias: string): Promise<string[]> {
    const params: QueryCommandInput = {
      KeyConditionExpression: `${this.followeeHandleAttr} = :followee`,
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
      ProjectionExpression: this.followerHandleAttr, // Include only follower aliases in the result
      TableName: this.tableName,
      IndexName: this.indexName,
    };
  
    const { Items } = await this.client.send(new QueryCommand(params));
  
    if (!Items || Items.length === 0) {
      return []; // No followers found, return an empty array
    }
  
    // Extract follower aliases from the items
    const followerAliases: string[] = Items.map(item => item[this.followerHandleAttr]);
  
    return followerAliases;
  }  
} 