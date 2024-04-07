import { AuthToken, GetCountRequest, GetFollowerOrFolloweeCountResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFolloweesCountLambda{
    handler = async(json: GetCountRequest): Promise<GetFollowerOrFolloweeCountResponse> => {
        if (!json.authToken || !json.user){
            throw new Error("[Bad Request] Request is missing user or authToken");
        }
        let event: GetCountRequest = new GetCountRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!);
        let response = new GetFollowerOrFolloweeCountResponse(await new FollowService().getFolloweesCount(event.authToken, event.user), true, undefined);
        return response;
    }
}

export const handler = new GetFolloweesCountLambda().handler;