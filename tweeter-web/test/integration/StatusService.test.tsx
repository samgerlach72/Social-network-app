import { AuthToken, User } from 'tweeter-shared';
import { StatusService } from '../../src/model/model/StatusService';
import "isomorphic-fetch";

describe('Integration test for StatusService', () => {
    let statusService: StatusService;
  
    beforeAll(() => {
      statusService = new StatusService();
    });
  
    test('Get user story pages', async () => {
      const authToken = new AuthToken("token", 10);
      const user = new User("firstname", "lastname", "alias", "imageurl");
      const pageSize = 10;
      const lastItem = null;
  
      const [statusses, hasMoreItems] = await statusService.loadMoreStoryItems(authToken, user, pageSize, lastItem);

      expect(statusses).toBeDefined();
      expect(statusses.length).toBe(10);
    });
})