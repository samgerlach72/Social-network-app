import { To, NavigateOptions } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";


export interface AuthenticationView extends View{
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void; 
    navigate: (to: To, options?: NavigateOptions | undefined) => void;
}

export abstract class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {

    public constructor(view: T){
        super(view);
    }

    public async doAuthenticationOperation(alias: string, password: string, rememberMeRef: React.MutableRefObject<boolean>, originalUrl: string | undefined, firstName?: string, lastName?: string, imageBytes?: Uint8Array) {
        let [user, authToken] = await this.callService(alias, password, firstName, lastName, imageBytes);
        this.view.updateUserInfo(user, user, authToken, rememberMeRef.current);
        if (!!originalUrl) {
        this.view.navigate(originalUrl);
        } else {
        this.view.navigate("/");
        }
    };

    protected abstract callService(alias: string, password: string, firstName?: string, lastName?: string, imageBytes?: Uint8Array): Promise<[User, AuthToken]>;
}

