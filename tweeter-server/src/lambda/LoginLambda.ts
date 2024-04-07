import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LoginLambda{
    handler = async(json: LoginRequest): Promise<AuthenticateResponse> => {
        if (!json.username || !json.password){
            throw new Error("[Bad Request] Request is missing username or password");
        }
        let event: LoginRequest = new LoginRequest(json.username, json.password);
        try {
            const [user, token] = await new UserService().login(event.username, event.password);
            const response = new AuthenticateResponse(user, token, true, undefined);
            return response;
        } catch (error) {
            const response = new AuthenticateResponse(null, null, false, (error as Error).message);
            return response;
        }
    }
}

export const handler = new LoginLambda().handler;