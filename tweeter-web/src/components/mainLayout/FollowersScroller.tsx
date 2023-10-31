import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useState, useRef, useEffect } from "react";
import { ToastInfoContext } from "../toaster/ToastProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import UserItem from "../userItem/UserItem";

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

  const { displayedUser, authToken } =
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
            <UserItem value={item} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FollowersScroller;
