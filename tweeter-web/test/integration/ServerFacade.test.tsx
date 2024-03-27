import "isomorphic-fetch";
import { AuthToken, AuthenticateResponse, GetCountOrFollowRequest, LoadFeedOrStoryResponse, LoadMoreItemsRequest, RegisterRequest, User } from 'tweeter-shared';
import { ServerFacade } from '../../src/network/ServerFacade';

describe('Integration tests for ServerFacade class', () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  test('Register', async () => {
    const byteArray = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const registerRequest = new RegisterRequest("firstname", "lastname", "alias", "password", byteArray);
    const response: AuthenticateResponse = await serverFacade.register(registerRequest);
    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.message).toBe(undefined);
    expect(response.token).not.toBeNull();
    expect(response.user).not.toBeNull();
  });

  test('GetFollowers', async () => {
    const request = new LoadMoreItemsRequest<User>(new AuthToken("token", 10), new User("firstname", "lastname", "alias", "imageurl"), 10, null);
    const response: LoadFeedOrStoryResponse<User> = await serverFacade.loadMoreFollowers(request);
    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.message).toBe(undefined);
    expect(response.itemList).not.toBeNull();
    expect(response.hasMoreItems).not.toBeNull();
  });

  test('GetFollersCount', async () => {
    const request = new GetCountOrFollowRequest(new AuthToken("token", 10), new User("firstname", "lastname", "alias", "imageurl"))
    const response = await serverFacade.getFollowersCount(request);
    expect(response).toBeDefined();
    expect(response.success).toBe(true);
    expect(response.message).toBe(undefined);
    expect(response.count).not.toBeNull();
  });
});