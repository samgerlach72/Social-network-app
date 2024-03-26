import { GetCountOrFollowRequest, GetFollowerOrFolloweeCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFolloweesCountLambda{
    handler = async(event: GetCountOrFollowRequest): Promise<GetFollowerOrFolloweeCountResponse> => {
        try{
            let response = new GetFollowerOrFolloweeCountResponse(await new FollowService().getFolloweesCount(event.authToken, event.user), true, undefined);
            return response;
        } catch (error) {
            const response = new GetFollowerOrFolloweeCountResponse(null, false, (error as Error).message);
            return response;
        }
    }
}

export const handler = new GetFolloweesCountLambda().handler;