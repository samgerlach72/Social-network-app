import { AuthToken, User, Status, FakeData, LoadFeedOrStoryResponse, LoadMoreItemsRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const loadFeedOrStoryResponse: LoadFeedOrStoryResponse<Status> = await new ServerFacade().loadMoreFeedItems(new LoadMoreItemsRequest<Status>(authToken, user, pageSize, lastItem));
        return [loadFeedOrStoryResponse.itemList!, loadFeedOrStoryResponse.hasMoreItems!];
    };
    
    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const loadFeedOrStoryResponse: LoadFeedOrStoryResponse<Status> = await new ServerFacade().loadMoreStoryItems(new LoadMoreItemsRequest<Status>(authToken, user, pageSize, lastItem));
        return [loadFeedOrStoryResponse.itemList!, loadFeedOrStoryResponse.hasMoreItems!];
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void>{
        await new ServerFacade().postStatus(new PostStatusRequest(authToken, newStatus));
    };
}