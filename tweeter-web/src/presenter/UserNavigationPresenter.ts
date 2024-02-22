import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/model/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View{
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void
}

export class UserNavigationPresenter extends Presenter{
    private service: UserService;

    public constructor(view: UserNavigationView){
        super(view)
        this.service = new UserService();
    }

    protected get view(): UserNavigationView {
        return super.view as UserNavigationView;
    }

    public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
        this.doFailureReportingOperation(async() => {
            let alias = this.extractAlias(event.target.toString());    
            let user = await this.service.getUser(authToken!, alias);   
            if (!!user) {
                if (currentUser!.equals(user)) {
                this.view.setDisplayedUser(currentUser!);
                } else {
                this.view.setDisplayedUser(user);
                }
            }
        }, "get user");
    };

    private extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
    };
}