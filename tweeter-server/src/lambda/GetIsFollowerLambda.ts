import { AuthToken, GetIsFollowerOrFollowRequest, GetIsFollowerStatusResponse, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetIsFollowerLambda {
    handler = async (json: GetIsFollowerOrFollowRequest): Promise<GetIsFollowerStatusResponse> => {
        if (!json.authToken || !json.user || !json.selectedUser){
            throw new Error("[Bad Request] Request is missing user, selectedUser, or authToken");
        }
        let event: GetIsFollowerOrFollowRequest = new GetIsFollowerOrFollowRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!, User.fromJson(JSON.stringify(json.user))!, User.fromJson(JSON.stringify(json.selectedUser))!);
        const response = new GetIsFollowerStatusResponse(await new FollowService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser), true, undefined);
        return response;
    }
}

export const handler = new GetIsFollowerLambda().handler;
