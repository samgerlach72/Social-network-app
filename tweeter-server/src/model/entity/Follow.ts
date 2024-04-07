import { User } from "tweeter-shared";

export class Follow {
    follower_handle: string;
    follower: User;
    followee_handle: string;
    followee: User;
  
    constructor(
      follower_handle: string,
      follower: User,
      followee_handle: string,
      followee: User
    ) {
      this.follower_handle = follower_handle;
      this.follower = follower;
      this.followee_handle = followee_handle;
      this.followee = followee;
    }
  
    toString(): string {
      return (
        "Follow{" +
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
        "}"
      );
    }
  }
  