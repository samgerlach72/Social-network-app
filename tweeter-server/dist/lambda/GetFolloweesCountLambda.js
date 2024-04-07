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
exports.handler = exports.GetFolloweesCountLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
class GetFolloweesCountLambda {
    constructor() {
        this.handler = (json) => __awaiter(this, void 0, void 0, function* () {
            if (!json.authToken || !json.user) {
                throw new Error("[Bad Request] Request is missing user or authToken");
            }
            let event = new tweeter_shared_1.GetCountRequest(tweeter_shared_1.AuthToken.fromJson(JSON.stringify(json.authToken)), tweeter_shared_1.User.fromJson(JSON.stringify(json.user)));
            let response = new tweeter_shared_1.GetFollowerOrFolloweeCountResponse(yield new FollowService_1.FollowService().getFolloweesCount(event.authToken, event.user), true, undefined);
            return response;
        });
    }
}
exports.GetFolloweesCountLambda = GetFolloweesCountLambda;
exports.handler = new GetFolloweesCountLambda().handler;
