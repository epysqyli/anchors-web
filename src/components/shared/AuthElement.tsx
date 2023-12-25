import { RelayContext } from "~/contexts/relay";
import { Component, JSX, useContext } from "solid-js";

const AuthElement: Component<{ children: JSX.Element }> = (props): JSX.Element => {
  const { authMode } = useContext(RelayContext);

  if (authMode.get() == "private") {
    return <>{props.children}</>;
  } else {
    return <></>;
  }
};

export default AuthElement;
