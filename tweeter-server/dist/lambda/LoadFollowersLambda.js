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
exports.handler = exports.LoadFollowersLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FollowService_1 = require("../model/service/FollowService");
class LoadFollowersLambda {
    constructor() {
        this.handler = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = new tweeter_shared_1.LoadFeedOrStoryResponse(...(yield new FollowService_1.FollowService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem)), true, undefined);
                return response;
            }
            catch (error) {
                let response = new tweeter_shared_1.LoadFeedOrStoryResponse(null, null, false, error.message);
                return response;
            }
        });
    }
}
exports.LoadFollowersLambda = LoadFollowersLambda;
exports.handler = new LoadFollowersLambda().handler;
