import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class GetIsFollowerLambda {
    handler = async (event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
        try {
            const response = new GetIsFollowerStatusResponse(await new FollowService().getIsFollowerStatus(event.authToken, event.user, event.selectedUser), true, undefined);
            return response;
        } catch (error) {
            const response = new GetIsFollowerStatusResponse(false, false, (error as Error).message);
            return response
        }
    }
}

export const handler = new GetIsFollowerLambda().handler;
