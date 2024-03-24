import {  } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class LoginLambda{
    handler = async(event: LogoutRequest) => {
        await new UserService().logout(event.authToken);
    }
}