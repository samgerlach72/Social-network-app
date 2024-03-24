import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

export class LoginRequest {
    username: string; 
    password: string;

    constructor (username: string, password: string) {
        this.username = username;
        this.password = password;
    }
}

export class LogoutRequest {
    authToken: AuthToken

    constructor (authToken: AuthToken) {
        this.authToken = authToken;
    }
}

export class RegisterRequest {
    firstName: string;
    lastName: string;
    alias: string;
    password: string;
    userImageBytes: Uint8Array;

    constructor (firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.alias = alias;
        this.password = password;
        this.userImageBytes = userImageBytes;
    }
}

export class GetUserRequest {
    authToken: AuthToken; 
    alias: string;

    constructor (authToken: AuthToken, alias: string) {
        this.authToken = authToken;
        this.alias = alias;
    }
}

//for load more feed, story, followers, or followees request
export class LoadMoreItemsRequest<T extends User | Status>{
    authToken: AuthToken;
    item: T;
    pageSize: number;
    lastItem: Status | null;

    constructor (authToken: AuthToken, item: T, pageSize: number, lastItem: Status | null) {
        this.authToken = authToken;
        this.item = item;
        this.pageSize = pageSize;
        this.lastItem = lastItem;
    }
}

export class PostStatusRequest {
    authToken: AuthToken;
    newStatus: Status;

    constructor (authToken: AuthToken, newStatus: Status) {
        this.authToken = authToken;
        this.newStatus = newStatus;
    }
}

export class GetIsFollowerStatusRequest {
    authToken: AuthToken;
    user: User;
    selectedUser: User;

    constructor(authToken: AuthToken, user: User, selectedUser: User){
        this.authToken = authToken;
        this.user = user;
        this.selectedUser = selectedUser;
    }
}

//for getFolloweesCount, getFollowersCount, follow, unfollow
export class GetCountOrFollowRequest {
    authToken: AuthToken;
    user: User;

    constructor(authToken: AuthToken, user: User){
        this.authToken = authToken;
        this.user = user;
    }
}

