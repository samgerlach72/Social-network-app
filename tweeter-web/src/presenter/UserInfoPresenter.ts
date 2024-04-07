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
            await this.service.getIsFollowerStatus(authToken!, displayedUser!, currentUser!)
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

    public async followDisplayedUser(authToken: AuthToken, currentUser: User, displayedUser: User) {
      this.doFailureReportingOperation(async() => {
        this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);
        let [followersCount, followeesCount] = await this.follow(authToken!, currentUser!, displayedUser!);
        this.view.clearLastInfoMessage();
        this.view.setIsFollower(true);
        this.view.setFollowersCount(followersCount);
        this.view.setFolloweesCount(followeesCount);
      }, "follow user");
    };

    public async follow(authToken: AuthToken, currentUser: User, userToFollow: User): Promise<[followersCount: number, followeesCount: number]> {
        await this.service.follow(authToken, currentUser!, userToFollow);

        let followersCount = await this.service.getFollowersCount(authToken, userToFollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToFollow);
    
        return [followersCount, followeesCount];
    };

    public async unfollowDisplayedUser(authToken: AuthToken, currentUser: User, displayedUser: User){
      this.doFailureReportingOperation(async() => {
        this.view.displayInfoMessage(`Removing ${displayedUser!.name} from followers...`, 0);
        let [followersCount, followeesCount] = await this.unfollow(authToken!, currentUser!, displayedUser!);
        this.view.clearLastInfoMessage();    
        this.view.setIsFollower(false);
        this.view.setFollowersCount(followersCount);
        this.view.setFolloweesCount(followeesCount);
      }, "unfollow user");
    };
    
    public async unfollow(authToken: AuthToken, currentUser: User, userToUnfollow: User): Promise<[followersCount: number, followeesCount: number]> {
        await this.service.unfollow(authToken, currentUser!, userToUnfollow);
    
        let followersCount = await this.service.getFollowersCount(authToken, userToUnfollow);
        let followeesCount = await this.service.getFolloweesCount(authToken, userToUnfollow);
    
        return [followersCount, followeesCount];
    };
}