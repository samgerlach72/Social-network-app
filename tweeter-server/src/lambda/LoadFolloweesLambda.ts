import { AuthToken, LoadFeedOrStoryResponse, LoadMoreItemsRequest, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class LoadFolloweesLambda{
    handler = async(json: LoadMoreItemsRequest<User>): Promise<LoadFeedOrStoryResponse<User>> => {
        if (!json.authToken || !json.user || !json.pageSize){
            throw new Error("[Bad Request] Request is missing user, authToken, or page size");
        }
        let event: LoadMoreItemsRequest<User>;
        if (!!json.lastItem){
            event = new LoadMoreItemsRequest<User>(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!, json.pageSize, User.fromJson(JSON.stringify(json.lastItem)));
        }
        else{
            event = new LoadMoreItemsRequest<User>(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!, json.pageSize, null);
        }
        let response = new LoadFeedOrStoryResponse(...(await new FollowService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem)), true, undefined);
        return response;
    }
}

export const handler = new LoadFolloweesLambda().handler;