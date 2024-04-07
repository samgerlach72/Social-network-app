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
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const ImageDao_1 = require("../concreteDao/ImageDao");
const crypto_js_1 = require("crypto-js");
const UsersDao_1 = require("../concreteDao/UsersDao");
const AuthtokenDao_1 = require("../concreteDao/AuthtokenDao");
class UserService {
    login(alias, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new UsersDao_1.UsersDAO().getUser(alias);
            if (result === null) {
                throw new Error("[Bad Request] Invalid alias or password");
            }
            const [user, hashedPassword] = result;
            if (this.verifyPassword(password, hashedPassword)) {
                const authtoken = tweeter_shared_1.AuthToken.Generate();
                yield new AuthtokenDao_1.AuthTokenDAO().putAuthtoken(authtoken);
                return [user, authtoken];
            }
            else {
                throw new Error("[Bad Request] Invalid alias or password");
            }
        });
    }
    ;
    logout(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // // Pause so we can see the logging out message. Delete when the call to the server is implemented.
            // await new Promise((res) => setTimeout(res, 1000));
            yield new AuthtokenDao_1.AuthTokenDAO().deleteAuthtoken(authToken);
        });
    }
    ;
    register(firstName, lastName, alias, password, userImageBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new tweeter_shared_1.User(firstName, lastName, alias, yield new ImageDao_1.ImageDao().putImage(alias, Buffer.from(userImageBytes).toString("base64")));
            new UsersDao_1.UsersDAO().putUser(user, this.hashAndSaltPassword(password));
            if (user === null) {
                throw new Error("[Bad Request] Invalid registration");
            }
            const authtoken = tweeter_shared_1.AuthToken.Generate();
            yield new AuthtokenDao_1.AuthTokenDAO().putAuthtoken(authtoken);
            return [user, authtoken];
        });
    }
    ;
    getUser(authToken, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new AuthtokenDao_1.AuthTokenDAO().validateAuthtoken(authToken);
            const result = yield new UsersDao_1.UsersDAO().getUser(alias);
            if (result === null) {
                throw new Error("[Bad Request] Invalid alias");
            }
            return result[0];
        });
    }
    ;
    hashAndSaltPassword(password) {
        const salt = this.generateSalt();
        let hashedPassword = salt + password;
        for (let i = 0; i < 1000; i++) {
            hashedPassword = (0, crypto_js_1.SHA256)(hashedPassword).toString(crypto_js_1.enc.Base64);
        }
        return `${salt}.${hashedPassword}`;
    }
    generateSalt() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    verifyPassword(password, hashedAndSaltedPassword) {
        const [salt, storedHashedPassword] = hashedAndSaltedPassword.split('.');
        let hashedPassword = salt + password;
        for (let i = 0; i < 1000; i++) {
            hashedPassword = (0, crypto_js_1.SHA256)(hashedPassword).toString(crypto_js_1.enc.Base64);
        }
        return hashedPassword === storedHashedPassword;
    }
}
exports.UserService = UserService;
