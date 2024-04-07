import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class RegisterLambda{
    handler = async(event: RegisterRequest): Promise<AuthenticateResponse> => {
        if (!event.firstName || !event.lastName || !event.alias || !event.password || !event.userImageBytes){
            throw new Error("[Bad Request] Request is missing firstname, lastname, alias, password, or userImageBytes");
        }
        let response = new AuthenticateResponse(...(await new UserService().register(event.firstName, event.lastName, event.alias, event.password, event.userImageBytes)), true, undefined);
        return response;
    }
}

export const handler = new RegisterLambda().handler;