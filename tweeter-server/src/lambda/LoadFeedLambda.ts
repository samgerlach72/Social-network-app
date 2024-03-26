import { AuthToken, LoadFeedOrStoryResponse, LoadMoreItemsRequest, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export class LoadFeedLambda{
    handler = async(json: LoadMoreItemsRequest<Status>): Promise<LoadFeedOrStoryResponse<Status>> => {
        let event: LoadMoreItemsRequest<Status>;
        if (json.lastItem !== null && json.lastItem !== undefined){
            event = new LoadMoreItemsRequest<Status>(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!, json.pageSize, Status.fromJson(JSON.stringify(json.lastItem)));
        }
        else{
            event = new LoadMoreItemsRequest<Status>(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!, json.pageSize, null);
        }
        try{
            const response = new LoadFeedOrStoryResponse(...(await new StatusService().loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem)), true, undefined);
            return response;
        } catch(error) {
            const response = new LoadFeedOrStoryResponse<Status>(null, null, false, (error as Error).message);
            return response;
        }
    }
}

export const handler = new LoadFeedLambda().handler;