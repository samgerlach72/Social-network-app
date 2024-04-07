import { AuthToken, User, FakeData, LoadFeedOrStoryResponse, LoginRequest, LoadMoreItemsRequest, GetIsFollowerStatusResponse, GetIsFollowerOrFollowRequest, GetCountRequest, GetFollowerOrFolloweeCountResponse } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  public async loadMoreFollowers(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
    ): Promise<[User[], boolean]> {
      const loadFeedOrStoryResponse: LoadFeedOrStoryResponse<User> = await new ServerFacade().loadMoreFollowers(new LoadMoreItemsRequest<User>(authToken, user, pageSize, lastItem));
      return [loadFeedOrStoryResponse.itemList!, loadFeedOrStoryResponse.hasMoreItems!];
  };

  public async loadMoreFollowees(
      authToken: AuthToken,
      user: User,
      pageSize: number,
      lastItem: User | null
    ): Promise<[User[], boolean]> {
      const loadFeedOrStoryResponse: LoadFeedOrStoryResponse<User> = await new ServerFacade().loadMoreFollowees(new LoadMoreItemsRequest<User>(authToken, user, pageSize, lastItem));
      return [loadFeedOrStoryResponse.itemList!, loadFeedOrStoryResponse.hasMoreItems!];
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
      const getIsFollowerStatusResponse: GetIsFollowerStatusResponse = await new ServerFacade().getIsFollowerStatus(new GetIsFollowerOrFollowRequest(authToken, user, selectedUser));
      return getIsFollowerStatusResponse.isFollower!;
  };

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
      const getFollowerOrFolloweeCountResponse: GetFollowerOrFolloweeCountResponse = await new ServerFacade().getFolloweesCount(new GetCountRequest(authToken, user));
      return getFollowerOrFolloweeCountResponse.count!;
  };

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
      const getFollowerOrFolloweeCountResponse: GetFollowerOrFolloweeCountResponse = await new ServerFacade().getFollowersCount(new GetCountRequest(authToken, user));
      return getFollowerOrFolloweeCountResponse.count!;
  };

  public async follow(authToken: AuthToken, currentUser: User, userToFollow: User): Promise<void> {
      await new ServerFacade().follow(new GetIsFollowerOrFollowRequest(authToken, currentUser, userToFollow));
  };

  public async unfollow(authToken: AuthToken, currentUser: User, userToUnfollow: User): Promise<void> {
    await new ServerFacade().unfollow(new GetIsFollowerOrFollowRequest(authToken, currentUser, userToUnfollow));
  };
}