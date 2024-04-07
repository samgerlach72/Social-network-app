import { AuthToken, User, FakeData } from "tweeter-shared";
import { FollowsDAO } from "../concreteDao/FollowsDao";
import { AuthTokenDAO } from "../concreteDao/AuthtokenDao";

export class FollowService {
    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        await new AuthTokenDAO().validateAuthtoken(authToken);
        return await new FollowsDAO().getPageOfFollowers(user.alias, pageSize, lastItem?.alias);
    };
  
    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        await new AuthTokenDAO().validateAuthtoken(authToken);
        return await new FollowsDAO().getPageOfFollowees(user.alias, pageSize, lastItem?.alias);
    };
  
    public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
      selectedUser: User
    ): Promise<boolean> {
      await new AuthTokenDAO().validateAuthtoken(authToken);
      return await new FollowsDAO().getIsFollower(selectedUser.alias, user.alias);
    };
  
    public async getFolloweesCount(
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      await new AuthTokenDAO().validateAuthtoken(authToken);
      return await new FollowsDAO().getFolloweesCount(user.alias);
    };
  
    public async getFollowersCount(
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      await new AuthTokenDAO().validateAuthtoken(authToken);
      return await new FollowsDAO().getFollowersCount(user.alias);
    };
    
    public async follow(authToken: AuthToken, selectedUser: User, userToFollow: User): Promise<void> {
      await new AuthTokenDAO().validateAuthtoken(authToken);
      await new FollowsDAO().putFollow(selectedUser, userToFollow);
    };

    public async unfollow(authToken: AuthToken, selectedUser: User, userToUnfollow: User): Promise<void> {
      await new AuthTokenDAO().validateAuthtoken(authToken);
      await new FollowsDAO().deleteFollow(selectedUser.alias, userToUnfollow.alias);
    };
}