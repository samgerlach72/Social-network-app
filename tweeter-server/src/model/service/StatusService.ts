import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { FeedDAO } from "../concreteDao/FeedDao";
import { AuthTokenDAO } from "../concreteDao/AuthtokenDao";
import { StoryDAO } from "../concreteDao/StoryDao";
import { UsersDAO } from "../concreteDao/UsersDao";
import { FollowsDAO } from "../concreteDao/FollowsDao";

export class StatusService {
    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        await new AuthTokenDAO().validateAuthtoken(authToken);
        return await new FeedDAO().getPageOfFeedItems(user.alias, pageSize, lastItem !== null ? lastItem : undefined);
    };
    
    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        await new AuthTokenDAO().validateAuthtoken(authToken);
        return await new StoryDAO().getPageOfStoryItems(user.alias, pageSize, lastItem !== null ? lastItem : undefined);
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void>{
        await new AuthTokenDAO().validateAuthtoken(authToken);
        await new StoryDAO().putStatus(newStatus);
        const followers = await new FollowsDAO().getAllFollowerAliasses(newStatus.user.alias);
        for (let i = 0; i < followers.length; i++) {
            await new FeedDAO().putStatus(newStatus, followers[i]);
        }
    };
}