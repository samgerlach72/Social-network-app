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
exports.StatusService = void 0;
const FeedDao_1 = require("../concreteDao/FeedDao");
const AuthtokenDao_1 = require("../concreteDao/AuthtokenDao");
const StoryDao_1 = require("../concreteDao/StoryDao");
class StatusService {
    loadMoreFeedItems(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new FeedDao_1.FeedDAO().getPageOfFeedItems(user.alias, pageSize, lastItem !== null ? lastItem : undefined);
        });
    }
    ;
    loadMoreStoryItems(authToken, user, pageSize, lastItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            return yield new StoryDao_1.StoryDAO().getPageOfStoryItems(user.alias, pageSize, lastItem !== null ? lastItem : undefined);
        });
    }
    ;
    postStatus(authToken, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            yield new StoryDao_1.StoryDAO().putStatus(newStatus);
        });
    }
    ;
}
exports.StatusService = StatusService;
