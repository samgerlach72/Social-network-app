import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, User } from "tweeter-shared";
import { FollowsDAO } from "./concreteDao/FollowsDao";
import { ImageDao } from "./concreteDao/ImageDao";
import { StoryDAO } from "./concreteDao/StoryDao";



class Main {
    dummyUser1: User;
    dummyUser2: User;
    dummyStatus: Status;

    constructor() {
        this.dummyUser1 = new User("Allen", "Anderson", "@allen", "https://tweeter-images-samg.s3.us-east-1.amazonaws.com/image/@alleng");
        this.dummyUser2 = new User("Jane", "Doe", "@jane", "https://tweeter-images-samg.s3.us-east-1.amazonaws.com/image/@jane");
        this.dummyStatus = new Status("this is a post", this.dummyUser1, Date.now())
    }

    async followsDaoTest() {
        const followsDAO = new FollowsDAO();

        // Test putFollow method
        await followsDAO.putFollow(this.dummyUser1, this.dummyUser2);
        // await followsDAO.putFollow(this.dummyUser2, this.dummyUser1);

        // Test getIsFollower method
        const isFollower = await followsDAO.getIsFollower(this.dummyUser1.alias, this.dummyUser2.alias);
        console.log("Is Follower:", isFollower);

        // Test deleteFollow method
        await followsDAO.deleteFollow(this.dummyUser1.alias, this.dummyUser2.alias);

        // Insert follows for dummyUser1 as the follower
        for (let i = 0; i < 4; i++) {
            const otherUserAlias = `Followee${i + 1}`; // Update otherUserAlias within the loop
            const follower = this.dummyUser1;
            const followee = new User("Jane", "Doe", otherUserAlias, "https://example.com/avatar.jpg");
            await followsDAO.putFollow(follower, followee);
        }

        // Insert follows for dummyUser1 as the followee
        for (let i = 0; i < 4; i++) {
            const otherUserAlias = `Follower${i + 1}`; // Update otherUserAlias within the loop
            const follower = new User("John", "Doe", otherUserAlias, "https://example.com/avatar.jpg");
            const followee = this.dummyUser1;
            await followsDAO.putFollow(follower, followee);
        }

        // Test getPageOfFollowees method
        const pageSize = 4;
        let lastFolloweeHandle = undefined; // Or provide a specific last followee handle
        let [followees, hasMorePages] = await followsDAO.getPageOfFollowees(this.dummyUser1.alias, pageSize, lastFolloweeHandle);
        console.log("Followees:", followees);
        console.log("Has More Pages:", hasMorePages);
        [followees, hasMorePages] = await followsDAO.getPageOfFollowees(this.dummyUser1.alias, pageSize, followees[3].alias);
        console.log("Followees:", followees);
        console.log("Has More Pages:", hasMorePages);

        // Test getPageOfFollowers method
        const lastFollowerHandle = undefined; // Or provide a specific last follower handle
        const [followers, hasMorePagesFollowers] = await followsDAO.getPageOfFollowers(this.dummyUser1.alias, pageSize, lastFollowerHandle);
        console.log("Followers:", followers);
        console.log("Has More Pages (Followers):", hasMorePagesFollowers);

        // Test getFolloweesCount method
        const followeesCount = await followsDAO.getFolloweesCount(this.dummyUser1.alias);
        console.log("Followees Count:", followeesCount);

        // Test getFollowersCount method
        const followersCount = await followsDAO.getFollowersCount(this.dummyUser1.alias);
        console.log("Followers Count:", followersCount);

        //Test 
        const followerAliasses = await followsDAO.getAllFollowerAliasses(this.dummyUser1.alias);
        console.log(followerAliasses);
    }

    async storyDaoTest() {
        const storyDao = new StoryDAO();
        await storyDao.putStatus(this.dummyStatus);
        let [statusses, hasMorePages] = await storyDao.getPageOfStoryItems("allen", 1, undefined)
        console.log("statusses:", statusses);
        console.log("Has More Pages:", hasMorePages);
        [statusses, hasMorePages] = await storyDao.getPageOfStoryItems(this.dummyUser1.alias, 2, statusses[0]);
        console.log("statusses:", statusses);
        console.log("Has More Pages:", hasMorePages);
    }
}

function run() {
    new Main().followsDaoTest();
    // new Main().storyDaoTest();
}

run();
