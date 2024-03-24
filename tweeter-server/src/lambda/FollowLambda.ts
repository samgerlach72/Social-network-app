import { GetCountOrFollowRequest } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export class FollowLambda{
    handler = async(event: GetCountOrFollowRequest): Promise<void> => {
        let response = await new FollowService().follow(event.authToken, event.user);
        return response;
    }
}