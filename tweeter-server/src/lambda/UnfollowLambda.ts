import { AuthToken, GetIsFollowerOrFollowRequest, TweeterResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class UnfollowLambda{
    handler = async(json: GetIsFollowerOrFollowRequest): Promise<TweeterResponse> => {
        if (!json.authToken || !json.user || !json.selectedUser){
            throw new Error("[Bad Request] Request is missing user or authToken");
        }
        let event: GetIsFollowerOrFollowRequest = new GetIsFollowerOrFollowRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!, User.fromJson(JSON.stringify(json.selectedUser))!);
        await new FollowService().unfollow(event.authToken, event.user, event.selectedUser);
        let response = new TweeterResponse(true, undefined)
        return response;
    }
}

export const handler = new UnfollowLambda().handler;