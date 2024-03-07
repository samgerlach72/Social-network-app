import { UserService } from "../model/model/UserService";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter<AuthenticationView> {
  private service: UserService;

  public constructor(view: AuthenticationView){
      super(view)
      this.service = new UserService();
  }

  public checkSubmitButtonStatus(alias: string, password: string) {
      return !alias || !password;
  };

  public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMeRef: React.MutableRefObject<boolean>) {
    this.doFailureReportingOperation(async() => {
      this.doAuthenticationOperation(alias, password, rememberMeRef, originalUrl);
    }, "log user in");
  };

  protected async callService(alias: string, password: string){
    return await this.service.login(alias, password);
  }
}