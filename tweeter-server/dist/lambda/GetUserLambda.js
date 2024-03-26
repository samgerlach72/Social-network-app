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
exports.handler = exports.GetUserLambda = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const UserService_1 = require("../model/service/UserService");
class GetUserLambda {
    constructor() {
        this.handler = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield new UserService_1.UserService().getUser(event.authToken, event.alias);
                return new tweeter_shared_1.GetUserResponse(user, true, undefined);
            }
            catch (error) {
                const errorMessage = error.message;
                return new tweeter_shared_1.GetUserResponse(null, false, errorMessage);
            }
        });
    }
}
exports.GetUserLambda = GetUserLambda;
exports.handler = new GetUserLambda().handler;
