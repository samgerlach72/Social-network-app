import { PostStatusRequest } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export class PostStatusLambda{
    handler = async(event: PostStatusRequest): Promise<void> => {
        let response = await new StatusService().postStatus(event.authToken, event.newStatus);
        return response;
    }
}