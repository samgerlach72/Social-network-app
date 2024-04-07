import { AuthToken, AuthenticateResponse, GetCountRequest, GetFollowerOrFolloweeCountResponse, GetIsFollowerOrFollowRequest, GetIsFollowerStatusResponse, GetUserRequest, GetUserResponse, LoadFeedOrStoryResponse, LoadMoreItemsRequest, LoginRequest, LogoutRequest, PostStatusRequest, RegisterRequest, Status, TweeterResponse, User } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {

  private SERVER_URL = "https://qcw9iydnkg.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  async login(request: LoginRequest): Promise<AuthenticateResponse>{
    const endpoint = "/login";
    console.log("before doPost")
    const jsonResponse = await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint);
    console.log(jsonResponse)
    return new AuthenticateResponse(User.fromJson(JSON.stringify(jsonResponse.user)), AuthToken.fromJson(JSON.stringify(jsonResponse.token)), jsonResponse.success, jsonResponse.message);
  }

  async logout(request: LogoutRequest): Promise<TweeterResponse>{
    const endpoint = "/logout";
    const jsonResponse = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(request, endpoint);
    return new TweeterResponse(jsonResponse.success, jsonResponse.message);
  }

  async register(request: RegisterRequest): Promise<AuthenticateResponse>{
    const endpoint = "/register";
    const jsonResponse = await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
    return new AuthenticateResponse(User.fromJson(JSON.stringify(jsonResponse.user)), AuthToken.fromJson(JSON.stringify(jsonResponse.token)), jsonResponse.success, jsonResponse.message);
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse>{
    const endpoint = "/get_user";
    const jsonResponse = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
    return new GetUserResponse(User.fromJson(JSON.stringify(jsonResponse.user)), jsonResponse.success, jsonResponse.message);
  }

  async loadMoreFollowers(request: LoadMoreItemsRequest<User>): Promise<LoadFeedOrStoryResponse<User>>{
    const endpoint = "/load_followers";
    const jsonResponse = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>, LoadFeedOrStoryResponse<User>>(request, endpoint);
    const userList: User[] = [];
    for (const userObj of jsonResponse.itemList!) {
        if (userObj !== null) { // Filter out null elements
            const user = User.fromJson(JSON.stringify(userObj)); // Convert each object to a User instance
            userList.push(user!); // Add the User instance to the list
        }
    }
    return new LoadFeedOrStoryResponse<User>(userList, jsonResponse.hasMoreItems, jsonResponse.success, jsonResponse.message);
  }

  async loadMoreFollowees(request: LoadMoreItemsRequest<User>): Promise<LoadFeedOrStoryResponse<User>>{
    const endpoint = "/load_followees";
    const jsonResponse = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>, LoadFeedOrStoryResponse<User>>(request, endpoint);
    const userList: User[] = [];
    for (const userObj of jsonResponse.itemList!) {
        if (userObj !== null) { // Filter out null elements
            const user = User.fromJson(JSON.stringify(userObj)); // Convert each object to a User instance
            userList.push(user!); // Add the User instance to the list
        }
    }
    return new LoadFeedOrStoryResponse<User>(userList, jsonResponse.hasMoreItems, jsonResponse.success, jsonResponse.message);
  }

  async getIsFollowerStatus(request: GetIsFollowerOrFollowRequest): Promise<GetIsFollowerStatusResponse>{
    const endpoint = "/get_is_follower";
    const jsonResponse = await this.clientCommunicator.doPost<GetIsFollowerOrFollowRequest, GetIsFollowerStatusResponse>(request, endpoint);
    return new GetIsFollowerStatusResponse(jsonResponse.isFollower, jsonResponse.success, jsonResponse.message);
  }

  async getFolloweesCount(request: GetCountRequest): Promise<GetFollowerOrFolloweeCountResponse>{
    const endpoint = "/get_followees_count";
    const jsonResponse = await this.clientCommunicator.doPost<GetCountRequest, GetFollowerOrFolloweeCountResponse>(request, endpoint);
    return new GetFollowerOrFolloweeCountResponse(jsonResponse.count, jsonResponse.success, jsonResponse.message);
  }

  async getFollowersCount(request: GetCountRequest): Promise<GetFollowerOrFolloweeCountResponse>{
    const endpoint = "/get_followers_count";
    const jsonResponse = await this.clientCommunicator.doPost<GetCountRequest, GetFollowerOrFolloweeCountResponse>(request, endpoint);
    return new GetFollowerOrFolloweeCountResponse(jsonResponse.count, jsonResponse.success, jsonResponse.message);
  }

  async follow(request: GetIsFollowerOrFollowRequest): Promise<TweeterResponse>{
    const endpoint = "/follow";
    const jsonResponse = await this.clientCommunicator.doPost<GetIsFollowerOrFollowRequest, TweeterResponse>(request, endpoint);
    return new TweeterResponse(jsonResponse.success, jsonResponse.message);
  }

  async unfollow(request: GetIsFollowerOrFollowRequest): Promise<TweeterResponse>{
    const endpoint = "/unfollow";
    const jsonResponse = await this.clientCommunicator.doPost<GetIsFollowerOrFollowRequest, TweeterResponse>(request, endpoint);
    return new TweeterResponse(jsonResponse.success, jsonResponse.message);
  }

  async postStatus(request: PostStatusRequest): Promise<TweeterResponse> {
    const endpoint = "/post_status";
    const jsonResponse = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, endpoint);
    return new TweeterResponse(jsonResponse.success, jsonResponse.message);
  }

  async loadMoreFeedItems(request: LoadMoreItemsRequest<Status>): Promise<LoadFeedOrStoryResponse<Status>> {
    const endpoint = "/load_feed";
    const jsonResponse = await this.clientCommunicator.doPost<LoadMoreItemsRequest<Status>, LoadFeedOrStoryResponse<Status>>(request, endpoint);
    const itemList: Status[] = [];
    for (const itemObj of jsonResponse.itemList || []) {
      if (itemObj !== null) {
        const item = Status.fromJson(JSON.stringify(itemObj));
        itemList.push(item!);
      }
    }
    return new LoadFeedOrStoryResponse<Status>(itemList, jsonResponse.hasMoreItems, jsonResponse.success, jsonResponse.message);
  }

  async loadMoreStoryItems(request: LoadMoreItemsRequest<Status>): Promise<LoadFeedOrStoryResponse<Status>> {
    const endpoint = "/load_story";
    const jsonResponse = await this.clientCommunicator.doPost<LoadMoreItemsRequest<Status>, LoadFeedOrStoryResponse<Status>>(request, endpoint);
    const itemList: Status[] = [];
    for (const itemObj of jsonResponse.itemList || []) {
      if (itemObj !== null) {
        const item = Status.fromJson(JSON.stringify(itemObj));
        itemList.push(item!);
      }
    }
    return new LoadFeedOrStoryResponse<Status>(itemList, jsonResponse.hasMoreItems, jsonResponse.success, jsonResponse.message);
  }
}