import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView{
    clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
    private service: UserService;

    public constructor(view: LogoutView){
        super(view);
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);
        this.doFailureReportingOperation(async() => {
            await this.service.logout(authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log user out");
    };
}