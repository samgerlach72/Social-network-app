import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView{
    clearUserInfo: () => void;
    // navigateToLogin: () => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
    private _service: UserService;

    public constructor(view: AppNavbarView){
        super(view);
        this._service = new UserService();
    }

    public get service() {
        return this._service;
    }

    public async logOut(authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);
        // this.view.navigateToLogin();
        this.doFailureReportingOperation(async() => {
            await this.service.logout(authToken!);
            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log user out");
    };
}