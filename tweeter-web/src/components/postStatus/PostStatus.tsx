import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PostPresenter, PostView } from "../../presenter/PostPresenter";

interface Props {
  presenter?: PostPresenter;
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();
  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");

  const listener: PostView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    setPost: setPost
  };

  const [presenter] = useState(props.presenter ?? new PostPresenter(listener));

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.submitPost(post, currentUser!, authToken!);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          aria-label="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          aria-label="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={presenter.checkButtonStatus(post, currentUser!, authToken!)}
          onClick={(event) => submitPost(event)}
        >
          Post Status
        </button>
        <button
          id="clearStatusButton"
          aria-label="clearButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={presenter.checkButtonStatus(post, currentUser!, authToken!)}
          onClick={(event) => clearPost(event)}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
