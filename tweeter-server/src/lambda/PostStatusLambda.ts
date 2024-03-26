import { PostStatusRequest, TweeterRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export class PostStatusLambda{
    handler = async(event: PostStatusRequest): Promise<TweeterResponse> => {
        try{
            await new StatusService().postStatus(event.authToken, event.newStatus);
            let response = new TweeterResponse(true, undefined)
            return response;
        } catch(error) {
            let response = new TweeterResponse(false, (error as Error).message)
            return response;
        }
    }
}

export const handler = new PostStatusLambda().handler;