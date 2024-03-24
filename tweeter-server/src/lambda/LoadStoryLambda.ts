import { LoadFeedOrStoryResponse, LoadMoreItemsRequest, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export class LoadStoryLambda{
    handler = async(event: LoadMoreItemsRequest<Status>): Promise<LoadFeedOrStoryResponse<Status>> => {
        let response = new LoadFeedOrStoryResponse(...(await new StatusService().loadMoreStoryItems(event.authToken, event.user, event.pageSize, event.lastItem)));
        return response;
    }
}