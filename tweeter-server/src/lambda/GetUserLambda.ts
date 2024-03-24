import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class GetUserLambda{
    handler = async(event: GetUserRequest): Promise<GetUserResponse> => {
        await new UserService().getUser(event.authToken, event.alias)
        let response = new GetUserResponse(await new UserService().getUser(event.authToken, event.alias));
        return response;
    }
}