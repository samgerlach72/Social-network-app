import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FollowingPresenter } from "./presenter/userItem/FollowingPresenter";
import { UserItemView } from "./presenter/userItem/UserItemPresenter";
import { FollowersPresenter } from "./presenter/userItem/FollowersPresenter";
import { StatusItemView } from "./presenter/statusItem/StatusItemPresenter";
import { StoryPresenter } from "./presenter/statusItem/StoryPresenter";
import { FeedPresenter } from "./presenter/statusItem/FeedPresenter";

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
            <StatusItemScroller  
              PresenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
            />
          } 
        />
        <Route 
          path="story" 
          element={
            <StatusItemScroller  
              PresenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
            />
          } 
        />
        <Route
          path="following"
          element={
            <UserItemScroller
              PresenterGenerator={(view: UserItemView) => new FollowingPresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              PresenterGenerator={(view: UserItemView) => new FollowersPresenter(view)}
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
