import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import { ToastInfoContext } from "../toaster/ToastProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

export const PAGE_SIZE = 10;

const FollowersScroller = () => {
  const { displayErrorToast } = useContext(ToastInfoContext);
  const [items, setItems] = useState<User[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<User | null>(null);

  // Required to allow the addItems method to see the current value of 'items'
  // instead of the value from when the closure was created.
  const itemsReference = useRef(items);
  itemsReference.current = items;

  const addItems = (newItems: User[]) =>
    setItems([...itemsReference.current, ...newItems]);

  const { displayedUser, setDisplayedUser, currentUser, authToken } =
    useContext(UserInfoContext);

  // Load initial items
  useEffect(() => {
    loadMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMoreItems = async () => {
    try {
      if (hasMoreItems) {
        let [newItems, hasMore] = await loadMoreFollowers(
          authToken!,
          displayedUser!,
          PAGE_SIZE,
          lastItem
        );

        setHasMoreItems(hasMore);
        setLastItem(newItems[newItems.length - 1]);
        addItems(newItems);
      }
    } catch (error) {
      displayErrorToast(
        `Failed to load followers because of exception: ${error}`,
        0
      );
    }
  };

  const loadMoreFollowers = async (
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastFollower: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, user);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      let alias = extractAlias(event.target.toString());

      let user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorToast(`Failed to get user because of exception: ${error}`, 0);
    }
  };

  const extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={item.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {item.firstName} {item.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={item.alias}
                        onClick={(event) => navigateToUser(event)}
                      >
                        {item.alias}
                      </Link>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FollowersScroller;
