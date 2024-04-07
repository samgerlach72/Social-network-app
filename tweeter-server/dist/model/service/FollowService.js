"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const FollowsDao_1 = require("../concreteDao/FollowsDao");
const AuthtokenDao_1 = require("../concreteDao/AuthtokenDao");
class FollowService {
    loadMoreFollowers(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new FollowsDao_1.FollowsDAO().getPageOfFollowers(user.alias, pageSize, lastItem === null || lastItem === void 0 ? void 0 : lastItem.alias);
        });
    }
    ;
    loadMoreFollowees(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new FollowsDao_1.FollowsDAO().getPageOfFollowees(user.alias, pageSize, lastItem === null || lastItem === void 0 ? void 0 : lastItem.alias);
        });
    }
    ;
    getIsFollowerStatus(authToken, user, selectedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new FollowsDao_1.FollowsDAO().getIsFollower(selectedUser.alias, user.alias);
        });
    }
    ;
    getFolloweesCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new FollowsDao_1.FollowsDAO().getFolloweesCount(user.alias);
        });
    }
    ;
    getFollowersCount(authToken, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new FollowsDao_1.FollowsDAO().getFollowersCount(user.alias);
        });
    }
    ;
    follow(authToken, selectedUser, userToFollow) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            yield new FollowsDao_1.FollowsDAO().putFollow(selectedUser, userToFollow);
        });
    }
    ;
    unfollow(authToken, selectedUser, userToUnfollow) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            yield new FollowsDao_1.FollowsDAO().deleteFollow(selectedUser.alias, userToUnfollow.alias);
        });
    }
    ;
}
exports.FollowService = FollowService;
