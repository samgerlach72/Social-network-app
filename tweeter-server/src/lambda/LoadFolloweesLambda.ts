import { LoadFeedOrStoryResponse, LoadMoreItemsRequest, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class LoadFolloweesLambda{
    handler = async(event: LoadMoreItemsRequest<User>): Promise<LoadFeedOrStoryResponse<User>> => {
        try{
            let response = new LoadFeedOrStoryResponse(...(await new FollowService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem)), true, undefined);
            return response;
        } catch(error) {
            let response = new LoadFeedOrStoryResponse<User>(null, null, false, (error as Error).message);
            return response;
        }
    }
}

export const handler = new LoadFolloweesLambda().handler;