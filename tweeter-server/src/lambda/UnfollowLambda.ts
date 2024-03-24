import { GetCountOrFollowRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class UnfollowLambda{
    handler = async(event: GetCountOrFollowRequest): Promise<void> => {
        let response = await new FollowService().unfollow(event.authToken, event.user);
        return response;
    }
}