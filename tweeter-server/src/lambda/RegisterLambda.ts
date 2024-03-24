import { AuthenticateResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class RegisterLambda{
    handler = async(event: RegisterRequest): Promise<AuthenticateResponse> => {
        let response = new AuthenticateResponse(...(await new UserService().register(event.firstName, event.lastName, event.alias, event.password, event.userImageBytes)));
        return response;
    }
}