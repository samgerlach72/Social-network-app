import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/model/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void
}

export class UserNavigationPresenter{
    private view: UserNavigationView;
    private service: UserService;

    public constructor(view: UserNavigationView){
        this.view = view;
        this.service = new UserService();
    }

    public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
        try {
            let alias = this.extractAlias(event.target.toString());
    
            let user = await this.service.getUser(authToken!, alias);
    
            if (!!user) {
                if (currentUser!.equals(user)) {
                this.view.setDisplayedUser(currentUser!);
                } else {
                this.view.setDisplayedUser(user);
                }
            }
            } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    private extractAlias(value: string): string {
        let index = value.indexOf("@");
        return value.substring(index);
    };
}