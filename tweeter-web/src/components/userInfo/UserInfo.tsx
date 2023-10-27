import "./UserInfo.css";
import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastInfoContext } from "../toaster/ToastProvider";
import { AuthToken, FakeData, User } from "tweeter-shared";

const UserInfo = () => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeesCount, setFolloweesCount] = useState(-1);
  const [followersCount, setFollowersCount] = useState(-1);
  const { displayErrorToast, displayInfoToast, deleteLastInfoToast } =
    useContext(ToastInfoContext);

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useContext(UserInfoContext);

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumbFollowees(authToken!, displayedUser!);
    setNumbFollowers(authToken!, displayedUser!);
  });

  const setIsFollowerStatus = async (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) => {
    try {
      if (currentUser === displayedUser) {
        setIsFollower(false);
      } else {
        setIsFollower(
          await getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      displayErrorToast(
        `Failed to determine follower status because of exception: ${error}`,
        0
      );
    }
  };

  const getIsFollowerStatus = async (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  const setNumbFollowees = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      setFolloweesCount(await getFolloweesCount(authToken, displayedUser));
    } catch (error) {
      displayErrorToast(
        `Failed to get followees count because of exception: ${error}`,
        0
      );
    }
  };

  const getFolloweesCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweesCount(user);
  };

  const setNumbFollowers = async (
    authToken: AuthToken,
    displayedUser: User
  ) => {
    try {
      setFollowersCount(await getFollowersCount(authToken, displayedUser));
    } catch (error) {
      displayErrorToast(
        `Failed to get followers count because of exception: ${error}`,
        0
      );
    }
  };

  const getFollowersCount = async (
    authToken: AuthToken,
    user: User
  ): Promise<number> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowersCount(user);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  const followDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      displayInfoToast(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await follow(
        authToken!,
        displayedUser!
      );

      deleteLastInfoToast();

      setIsFollower(true);
      setFollowersCount(followersCount);
      setFolloweesCount(followeesCount);
    } catch (error) {
      displayErrorToast(
        `Failed to follow user because of exception: ${error}`,
        0
      );
    }
  };

  const follow = async (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> => {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await getFollowersCount(authToken, userToFollow);
    let followeesCount = await getFolloweesCount(authToken, userToFollow);

    return [followersCount, followeesCount];
  };

  const unfollowDisplayedUser = async (
    event: React.MouseEvent
  ): Promise<void> => {
    event.preventDefault();

    try {
      displayInfoToast(`Removing ${displayedUser!.name} from followers...`, 0);

      let [followersCount, followeesCount] = await unfollow(
        authToken!,
        displayedUser!
      );

      deleteLastInfoToast();

      setIsFollower(false);
      setFollowersCount(followersCount);
      setFolloweesCount(followeesCount);
    } catch (error) {
      displayErrorToast(
        `Failed to unfollow user because of exception: ${error}`,
        0
      );
    }
  };

  const unfollow = async (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> => {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    let followersCount = await getFollowersCount(authToken, userToUnfollow);
    let followeesCount = await getFolloweesCount(authToken, userToUnfollow);

    return [followersCount, followeesCount];
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeesCount > -1 && followersCount > -1 && (
                <div>
                  Following: {followeesCount} Followers: {followersCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      onClick={(event) => unfollowDisplayedUser(event)}
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      onClick={(event) => followDisplayedUser(event)}
                    >
                      Follow
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
