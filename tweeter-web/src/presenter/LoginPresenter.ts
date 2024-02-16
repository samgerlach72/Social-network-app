import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { To, NavigateOptions } from "react-router-dom";

export interface LoginView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, 
    navigate: (to: To, options?: NavigateOptions | undefined) => void,
    rememberMeRef: React.MutableRefObject<boolean>
}

export class LoginPresenter{
    private view: LoginView;
    private service: UserService;

    public constructor(view: LoginView){
        this.view = view;
        this.service = new UserService();
    }

    public checkSubmitButtonStatus(alias: string, password: string) {
        return !alias || !password;
    };
    public async doLogin(alias: string, password: string, originalUrl: string | undefined) {
        try {
          let [user, authToken] = await this.service.login(alias, password);
    
          this.view.updateUserInfo(user, user, authToken, this.view.rememberMeRef.current);
    
          if (!!originalUrl) {
            this.view.navigate(originalUrl);
          } else {
            this.view.navigate("/");
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`
          );
        }
    };
}