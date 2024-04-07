import { AuthToken, GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class GetUserLambda {
    handler = async (json: GetUserRequest): Promise<GetUserResponse> => {
        if (!json.authToken || !json.alias){
            throw new Error("[Bad Request] Request is missing authToken or alias");
        }
        let event: GetUserRequest = new GetUserRequest(AuthToken.fromJson(JSON.stringify(json.authToken))!, json.alias);
        const user = await new UserService().getUser(event.authToken, event.alias);
        return new GetUserResponse(user, true, undefined);
    }
}

export const handler = new GetUserLambda().handler;
