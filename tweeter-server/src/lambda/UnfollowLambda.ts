import { GetCountOrFollowRequest, TweeterRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class UnfollowLambda{
    handler = async(event: GetCountOrFollowRequest): Promise<TweeterResponse> => {
        try {
            await new FollowService().unfollow(event.authToken, event.user);
            let response = new TweeterResponse(true, undefined)
            return response;
        } catch(error) {
            let response = new TweeterResponse(false, (error as Error).message)
            return response;
        }
    }
}

export const handler = new UnfollowLambda().handler;