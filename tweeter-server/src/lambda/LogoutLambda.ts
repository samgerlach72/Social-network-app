import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LogoutLambda{
    handler = async(event: LogoutRequest): Promise<TweeterResponse> => {
        try {
            await new UserService().logout(event.authToken);
            let response = new TweeterResponse(true, undefined)
            return response;
        } catch(error) {
            let response = new TweeterResponse(false, (error as Error).message)
            return response;
        }
    }
}

export const handler = new LogoutLambda().handler;