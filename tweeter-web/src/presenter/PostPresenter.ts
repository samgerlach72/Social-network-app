import { User, AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../model/model/StatusService";

export interface PostView {
    displayErrorMessage: (message: string) => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void,
    clearLastInfoMessage: () => void,
    setPost: React.Dispatch<React.SetStateAction<string>>
}

export class PostPresenter{
    private view: PostView;
    private service: StatusService;

    public constructor(view: PostView){
        this.view = view;
        this.service = new StatusService();
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        try {
          this.view.displayInfoMessage("Posting status...", 0);
    
          let status = new Status(post, currentUser!, Date.now());
    
          await this.service.postStatus(authToken!, status);
    
          this.view.clearLastInfoMessage();
          this.view.setPost("");
          this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
          );
        }
    };

    checkButtonStatus(post: string, currentUser: User, authToken: AuthToken): boolean {
        return !post.trim() || !authToken || !currentUser;
    }
}