import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();
  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    rememberMeRef: rememberMeRef
  };
  const presenter = new LoginPresenter(listener);

  const doLogin = async () => {
    presenter.doLogin(alias, password, props.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields aliasfn={(event) => setAlias(event.target.value)} passwordfn={(event) => setPassword(event.target.value)}/>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => presenter.checkSubmitButtonStatus(alias, password)}
      submit={doLogin}
    />
  );
};

export default Login;
