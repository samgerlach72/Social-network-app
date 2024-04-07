"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
class Follow {
    constructor(follower_handle, follower, followee_handle, followee) {
        this.follower_handle = follower_handle;
        this.follower = follower;
        this.followee_handle = followee_handle;
        this.followee = followee;
    }
    toString() {
        return ("Follow{" +
            "follower_handle='" +
            this.follower_handle +
            "'" +
            ", follower_name='" +
            this.follower +
            "'" +
            ", followee_handle='" +
            this.followee_handle +
            "'" +
            ", followee_name='" +
            this.followee +
            "'" +
            "}");
    }
}
exports.Follow = Follow;
