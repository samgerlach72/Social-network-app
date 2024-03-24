import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
    public async loadMoreFollowers(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
    };
  
    public async loadMoreFollowees(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
    };
  
    public async getIsFollowerStatus(
      authToken: AuthToken,
      user: User,
      selectedUser: User
    ): Promise<boolean> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.isFollower();
    };
  
    public async getFolloweesCount(
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getFolloweesCount(user);
    };
  
    public async getFollowersCount(
      authToken: AuthToken,
      user: User
    ): Promise<number> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getFollowersCount(user);
    };
    
    public async follow(authToken: AuthToken, userToFollow: User): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((f) => setTimeout(f, 2000));
    };

    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      await new Promise((f) => setTimeout(f, 2000));
    };
}