import { User, AuthToken, LoginRequest, AuthenticateResponse, LogoutRequest, RegisterRequest, GetUserResponse, GetUserRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const authenticateResponse: AuthenticateResponse = await new ServerFacade().login(new LoginRequest(alias, password));
        return [authenticateResponse.user!, authenticateResponse.token!];
    };

    public async logout(authToken: AuthToken): Promise<void> {
        await new ServerFacade().logout(new LogoutRequest(authToken));
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array
    ): Promise<[User, AuthToken]> {
        const authenticateResponse: AuthenticateResponse = await new ServerFacade().register(new RegisterRequest(firstName, lastName, alias, password, userImageBytes));
        return [authenticateResponse.user!, authenticateResponse.token!];
    };

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        const getUserResponse: GetUserResponse = await new ServerFacade().getUser(new GetUserRequest(authToken, alias));
        return getUserResponse.user;
    };
}