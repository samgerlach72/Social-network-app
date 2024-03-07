import React from "react";
import {MemoryRouter} from "react-router-dom";
import PostStatus from "../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { PostPresenter } from "../../src/presenter/PostPresenter";
import { anything, instance, mock, verify } from "ts-mockito";
import useUserInfo from "../../src/components/userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";


jest.mock("../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
})); 

describe("PostStatus Componenent", () => {
    const mockUser = mock<User>();
    const mockUserInstance = instance(mockUser);
    const mockAuthToken = mock<AuthToken>();
    const mockAuthTokenInstance = instance(mockAuthToken);

    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
        currentUser: mockUserInstance,
        authToken: mockAuthTokenInstance,
        });
    });

    it("starts with the Post Status and Clear buttons disabled", () => {
        const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it ("enables both buttons when the text field has text", async () => {
        const { postStatusButton, clearButton, postStatusTextArea, user } = renderPostStatusAndGetElements();

        await user.type(postStatusTextArea, "a"); 
        // console.log(postStatusTextArea);
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it ("disables both buttons when the text field is cleared", async () => {
        const { postStatusButton, clearButton, postStatusTextArea, user } = renderPostStatusAndGetElements();

        await user.type(postStatusTextArea, "a"); 
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
        
        await user.clear(postStatusTextArea);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("calls the presenters postStatus method with correct parameters when the post status button is pressed", async () => {
        const mockPresenter = mock<PostPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const dummyPost = "this is a post";
        const { postStatusButton, clearButton, postStatusTextArea, user } = renderPostStatusAndGetElements(mockPresenterInstance);
        await user.type(postStatusTextArea, dummyPost);
        await user.click(postStatusButton);
        verify(mockPresenter.submitPost(dummyPost, anything(), anything())).once();
    });
});

const renderPostStatus = (presenter?: PostPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (<PostStatus presenter={presenter} />) : (<PostStatus />)};
        </MemoryRouter>
    );
};

const renderPostStatusAndGetElements = (presenter?: PostPresenter) => {
    const user = userEvent.setup();
    renderPostStatus(presenter);
    const postStatusButton = screen.getByLabelText("postStatusButton");
    const clearButton = screen.getByLabelText("clearButton");
    const postStatusTextArea = screen.getByLabelText("postStatusTextArea");


    return { postStatusButton, clearButton, postStatusTextArea, user };
}