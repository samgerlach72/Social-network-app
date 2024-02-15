import useToastListener from "./toaster/ToastListenerHook";
import useUserInfo from "./userInfo/UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../presenter/UserNavigationPresenter";

const useUserNavigationHook = () => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useUserInfo();
    const listener: UserNavigationView = {
        displayErrorMessage: displayErrorMessage,
        setDisplayedUser: setDisplayedUser
    };
    const presenter = new UserNavigationPresenter(listener);
    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(event, authToken!, currentUser!);
    };
    return(
        navigateToUser
    );
} 

export default useUserNavigationHook;