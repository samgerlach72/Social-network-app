import { AuthToken, Status, User } from "tweeter-shared";
import { PostPresenter, PostView } from "../../src/presenter/PostPresenter";
import { instance, mock, verify, spy, when, anything, capture } from "ts-mockito";
import { StatusService } from "../../src/model/model/StatusService";

describe("PostPresenter", () => {
    let mockPostPresenterView: PostView;
    let postPresenter: PostPresenter;
    let mockStatusService: StatusService;
    let mockStatus: Status;

    const post = "post content";
    const user = new User("firstName", "lastName", "alias", "imageUrl");
    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockPostPresenterView = mock<PostView>();
        const mockPostPresenterViewInstance = instance(mockPostPresenterView);

        const postPresenterSpy = spy(new PostPresenter(mockPostPresenterViewInstance));
        postPresenter = instance(postPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postPresenterSpy.service).thenReturn(mockStatusServiceInstance);
    });

    it("tells the view to display a posting status message.", async () => {
        await postPresenter.submitPost(post, user, authToken);
        verify(mockPostPresenterView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postPresenter.submitPost(post, user, authToken);
        verify(mockStatusService.postStatus(anything(), anything())).once();
        
        let [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();
        expect(capturedAuthToken).toEqual(authToken);
        expect(capturedStatus.post).toEqual(post);
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when post successful", async () => {
        await postPresenter.submitPost(post, user, authToken);

        verify(mockPostPresenterView.clearLastInfoMessage()).once();
        verify(mockPostPresenterView.setPost("")).once();
        verify(mockPostPresenterView.displayInfoMessage("Status posted!", 2000)).once();

        verify(mockPostPresenterView.displayErrorMessage(anything())).never();
    });

    it("tells the view to display an error message and does not tell it to clear the last info message, clear the post, and display a status posted message when post not successful", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);
        await postPresenter.submitPost(post, user, authToken);

        verify(mockPostPresenterView.clearLastInfoMessage()).never();
        verify(mockPostPresenterView.setPost(anything())).never();
        verify(mockPostPresenterView.displayInfoMessage("Status posted!", 2000)).never();

        verify(mockPostPresenterView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
    });
});
