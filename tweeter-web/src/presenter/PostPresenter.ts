import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/model/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostView extends MessageView{
    setPost: React.Dispatch<React.SetStateAction<string>>;
}

export class PostPresenter extends Presenter<PostView> {
    private _service: StatusService;

    public get service(){
      return this._service;
    }

    public constructor(view: PostView){
        super(view)
        this._service = new StatusService();
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
      this.doFailureReportingOperation(async() => {
        this.view.displayInfoMessage("Posting status...", 0);
        let status = new Status(post, currentUser!, Date.now());
        await this.service.postStatus(authToken!, status);
        this.view.clearLastInfoMessage();
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      }, "post the status");
    };

    checkButtonStatus(post: string, currentUser: User, authToken: AuthToken): boolean {
        return !post.trim() || !authToken || !currentUser;
    }
}