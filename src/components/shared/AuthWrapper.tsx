import { RelayContext } from "~/contexts/relay";
import { Component, JSX, useContext } from "solid-js";

const AuthWrapper: Component<{ children: JSX.Element; fallback?: JSX.Element }> = (props): JSX.Element => {
  const { authMode } = useContext(RelayContext);

  if (authMode.get() == "private") {
    return <>{props.children}</>;
  } else {
    return props.fallback ?? <></>;
  }
};

export default AuthWrapper;
