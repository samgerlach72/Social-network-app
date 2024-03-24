import { LoadFeedOrStoryResponse, LoadMoreItemsRequest, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class LoadFollowersLambda{
    handler = async(event: LoadMoreItemsRequest<User>): Promise<LoadFeedOrStoryResponse<User>> => {
        let response = new LoadFeedOrStoryResponse(...(await new FollowService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem)));
        return response;
    }
}