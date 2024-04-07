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
exports.handler = exports.LoadStoryLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../model/service/StatusService");
class LoadStoryLambda {
    constructor() {
        this.handler = (json) => __awaiter(this, void 0, void 0, function* () {
            if (!json.authToken || !json.user || !json.pageSize) {
                throw new Error("[Bad Request] Request is missing user, authToken, or page size");
            }
            let event;
            if (!!json.lastItem) {
                event = new tweeter_shared_1.LoadMoreItemsRequest(tweeter_shared_1.AuthToken.fromJson(JSON.stringify(json.authToken)), tweeter_shared_1.User.fromJson(JSON.stringify(json.user)), json.pageSize, tweeter_shared_1.Status.fromJson(JSON.stringify(json.lastItem)));
            }
            else {
                event = new tweeter_shared_1.LoadMoreItemsRequest(tweeter_shared_1.AuthToken.fromJson(JSON.stringify(json.authToken)), tweeter_shared_1.User.fromJson(JSON.stringify(json.user)), json.pageSize, null);
            }
            let response = new tweeter_shared_1.LoadFeedOrStoryResponse(...(yield new StatusService_1.StatusService().loadMoreStoryItems(event.authToken, event.user, event.pageSize, event.lastItem)), true, undefined);
            return response;
        });
    }
}
exports.LoadStoryLambda = LoadStoryLambda;
exports.handler = new LoadStoryLambda().handler;
