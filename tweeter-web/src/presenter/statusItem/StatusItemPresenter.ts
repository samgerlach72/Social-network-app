import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "../PagedItemPresenter";
import { View } from "../Presenter";
import { StatusService } from "../../model/model/StatusService";

export interface StatusItemView extends View{
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService>{
    protected createService(): StatusService {
        return new StatusService();
    }
}