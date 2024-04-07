import { AuthToken, GetCountRequest, GetFollowerOrFolloweeCountResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetFollowersCountLambda {
    handler = async(json: GetCountRequest): Promise<GetFollowerOrFolloweeCountResponse> => {
        if (!json.authToken || !json.user){
            throw new Error("[Bad Request] Request is missing user or authToken");
        }
        let event: GetCountRequest = new GetCountRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!);
        const count = await new FollowService().getFollowersCount(event.authToken, event.user);
        const response = new GetFollowerOrFolloweeCountResponse(count, true, undefined);
        return response;
    }
}

export const handler = new GetFollowersCountLambda().handler;
