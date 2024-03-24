import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

//used for login and register
export class AuthenticateResponse {
    user: User;
    token: AuthToken;

    constructor(user: User, token: AuthToken) {
        this.user = user;
        this. token = token;
    }
}

export class GetUserResponse {
    user: User | null;

    constructor(user: User | null) {
        this.user = user;
    }
}

//for load more feed, story, followers, or followees response
export class LoadFeedOrStoryResponse<T extends User | Status>{
    itemList: T[]; 
    hasMoreItems: boolean;

    constructor(itemList: T[], hasMoreItems: boolean) {
        this.itemList = itemList;
        this.hasMoreItems = hasMoreItems;
    }
}

export class GetIsFollowerStatusResponse {
    isFollower: boolean;

    constructor(isFollower: boolean){
        this.isFollower = isFollower;
    }
}

export class GetFollowerOrFolloweeCountResponse {
    count: number;

    constructor(count: number){
        this.count = count;
    }
}