import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/model/UserService";
import { To, NavigateOptions } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void, 
    navigate: (to: To, options?: NavigateOptions | undefined) => void,
    rememberMeRef: React.MutableRefObject<boolean>
}

export class LoginPresenter extends Presenter<LoginView> {
    private service: UserService;

    public constructor(view: LoginView){
        super(view)
        this.service = new UserService();
    }

    public checkSubmitButtonStatus(alias: string, password: string) {
        return !alias || !password;
    };

    public async doLogin(alias: string, password: string, originalUrl: string | undefined) {
      this.doFailureReportingOperation(async() => {
        let [user, authToken] = await this.service.login(alias, password);
        this.view.updateUserInfo(user, user, authToken, this.view.rememberMeRef.current);
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate("/");
        }
      }, "log user in")
    };
}