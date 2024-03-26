import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class RegisterLambda{
    handler = async(event: RegisterRequest): Promise<AuthenticateResponse> => {
        try{
            let response = new AuthenticateResponse(...(await new UserService().register(event.firstName, event.lastName, event.alias, event.password, event.userImageBytes)), true, undefined);
            return response;
        } catch(error) {
            let response = new AuthenticateResponse(null, null, false, (error as Error).message);
            return response;
        }
    }
}

export const handler = new RegisterLambda().handler;