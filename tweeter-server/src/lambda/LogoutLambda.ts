import { LogoutRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LogoutLambda{
    handler = async(event: LogoutRequest): Promise<void> => {
        let response = await new UserService().logout(event.authToken);
        return response;
    }
}