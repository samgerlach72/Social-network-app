import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class GetUserLambda {
    handler = async (event: GetUserRequest): Promise<GetUserResponse> => {
        try {
            const user = await new UserService().getUser(event.authToken, event.alias);
            return new GetUserResponse(user, true, undefined);
        } catch (error) {
            const errorMessage = (error as Error).message;
            return new GetUserResponse(null, false, errorMessage);
        }
    }
}

export const handler = new GetUserLambda().handler;
