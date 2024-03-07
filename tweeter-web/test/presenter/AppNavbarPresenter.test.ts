import { AuthToken } from "tweeter-shared";
import {AppNavbarPresenter, AppNavbarView } from "../../src/presenter/AppNavbarPresenter";
import { instance, mock, verify, spy, when, anything, capture } from "ts-mockito";
import { UserService } from "../../src/model/model/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarPresenterView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarPresenterView = mock<AppNavbarView>();
        const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarPresenterViewInstance))
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);

    });

    it("tells the view to display logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct authToken", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();
    });

    it("tells the view to clear the last info message and clear the user info when logout successful", async () => {
        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
        verify(mockAppNavbarPresenterView.clearUserInfo()).once();

        verify(mockAppNavbarPresenterView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).never();
    });

    it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when logout unsuccessful", async () => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);
        await appNavbarPresenter.logOut(authToken);

        verify(mockAppNavbarPresenterView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
        verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
        verify(mockAppNavbarPresenterView.clearUserInfo()).never();
    });
});