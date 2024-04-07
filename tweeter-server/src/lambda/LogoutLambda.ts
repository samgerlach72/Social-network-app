import { AuthToken, LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LogoutLambda{
    handler = async(json: LogoutRequest): Promise<TweeterResponse> => {
        if (!json.authToken){
            throw new Error("[Bad Request] Request is missing authToken");
        }
        let event: LogoutRequest = new LogoutRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!);
        await new UserService().logout(event.authToken);
        let response = new TweeterResponse(true, undefined)
        return response;
    }
}

export const handler = new LogoutLambda().handler;