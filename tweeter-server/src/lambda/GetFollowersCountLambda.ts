import { GetCountOrFollowRequest, GetFollowerOrFolloweeCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFollowersCountLambda{
    handler = async(event: GetCountOrFollowRequest): Promise<GetFollowerOrFolloweeCountResponse> => {
        let response = new GetFollowerOrFolloweeCountResponse(await new FollowService().getFollowersCount(event.authToken, event.user));
        return response;
    }
}