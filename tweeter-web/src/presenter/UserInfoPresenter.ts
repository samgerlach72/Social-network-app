import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/model/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView{
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    setFolloweesCount: React.Dispatch<React.SetStateAction<number>>;
    setFollowersCount: React.Dispatch<React.SetStateAction<number>>;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private service: FollowService;

    public constructor(view: UserInfoView){
        super(view);
        this.service = new FollowService();
    }

    protected get view(): UserInfoView {
      return super.view as UserInfoView;
    }

    public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
      this.doFailureReportingOperation(async() => {
        if (currentUser === displayedUser) {
          this.view.setIsFollower(false);
        } else {
          this.view.setIsFollower(
            await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
          );
        }
      }, "determine follower status")
    };

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
      this.doFailureReportingOperation(async() => {
        this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, displayedUser));
      }, "get followees count");
    };

    public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
      this.doFailureReportingOperation(async() => {
        this.view.setFollowersCount(await this.service.getFollowersCount(authToken, displayedUser));
      }, "get followers count");
    };

    public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
      this.doFailureReportingOperation(async() => {
        this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);
        let [followersCount, followeesCount] = await this.follow(authToken!, displayedUser!);
        this.view.clearLastInfoMessage();
        this.view.setIsFollower(true);
        this.view.setFollowersCount(followersCount);
        this.view.setFolloweesCount(followeesCount);
      }, "follow user");
    };

    public async follow(authToken: AuthToken, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the following message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
        let followersCount = await this.service.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToFollow);
    
        return [followersCount, followeesCount];
    };

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User){
      this.doFailureReportingOperation(async() => {
        this.view.displayInfoMessage(`Removing ${displayedUser!.name} from followers...`, 0);
        let [followersCount, followeesCount] = await this.unfollow(authToken!, displayedUser!);
        this.view.clearLastInfoMessage();    
        this.view.setIsFollower(false);
        this.view.setFollowersCount(followersCount);
        this.view.setFolloweesCount(followeesCount);
      }, "unfollow user");
    };
    
    public async unfollow(authToken: AuthToken, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
        // Pause so we can see the unfollowing message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server
    
        let followersCount = await this.service.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToUnfollow);
    
        return [followersCount, followeesCount];
    };
}