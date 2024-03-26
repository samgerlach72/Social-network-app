import { GetCountOrFollowRequest, GetFollowerOrFolloweeCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFollowersCountLambda {
    handler = async(event: GetCountOrFollowRequest): Promise<GetFollowerOrFolloweeCountResponse> => {
        try {
            const count = await new FollowService().getFollowersCount(event.authToken, event.user);
            const response = new GetFollowerOrFolloweeCountResponse(count, true, undefined);
            return response;
        } catch (error) {
            const errorMessage = (error as Error).message;
            const response = new GetFollowerOrFolloweeCountResponse(null, false, errorMessage);
            return response;
        }
    }
}

export const handler = new GetFollowersCountLambda().handler;
