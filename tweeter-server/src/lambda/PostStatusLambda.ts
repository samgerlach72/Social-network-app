import { AuthToken, PostStatusRequest, Status, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export class PostStatusLambda{
    handler = async(json: PostStatusRequest): Promise<TweeterResponse> => {
        if (!json.authToken || !json.newStatus){
            throw new Error("[Bad Request] Request is missing authToken or newStatus");
        }
        let event: PostStatusRequest = new PostStatusRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!, Status.fromJson(JSON.stringify(json.newStatus))!);
        await new StatusService().postStatus(event.authToken, event.newStatus);
        let response = new TweeterResponse(true, undefined)
        return response;
    }
}

export const handler = new PostStatusLambda().handler;