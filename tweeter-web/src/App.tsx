import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FollowingPresenter } from "./presenter/userItem/FollowingPresenter";
import { FollowersPresenter } from "./presenter/userItem/FollowersPresenter";
import { StoryPresenter } from "./presenter/statusItem/StoryPresenter";
import { FeedPresenter } from "./presenter/statusItem/FeedPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { PagedItemView } from "./presenter/PagedItemPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
          path="feed" 
          element={
            <ItemScroller  
              key="feed"
              PresenterGenerator={(view: PagedItemView<Status>) => new FeedPresenter(view)}
              ItemComponentGenerator={(item: Status) => <StatusItem item={item} />}
            />
          } 
        />
        <Route 
          path="story" 
          element={
            <ItemScroller  
              key="story"
              PresenterGenerator={(view: PagedItemView<Status>) => new StoryPresenter(view)}
              ItemComponentGenerator={(item: Status) => <StatusItem item={item} />}
            />
          } 
        />
        <Route
          path="following"
          element={
            <ItemScroller
              key="following"
              PresenterGenerator={(view: PagedItemView<User>) => new FollowingPresenter(view)}
              ItemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key="followers"
              PresenterGenerator={(view: PagedItemView<User>) => new FollowersPresenter(view)}
              ItemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
