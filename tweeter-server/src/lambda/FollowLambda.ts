import { GetCountOrFollowRequest, TweeterResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class FollowLambda{
    handler = async(event: GetCountOrFollowRequest): Promise<TweeterResponse> => {
        try{
            await new FollowService().follow(event.authToken, event.user);
            const response = new TweeterResponse(true, undefined);
            return response;
        } catch (error) {
            const response = new TweeterResponse(false, (error as Error).message);
            return response;
        }
    }
}

export const handler = new FollowLambda().handler;