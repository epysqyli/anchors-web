import "./index.css";
import { Component } from "solid-js";
import Counter from "~/components/Counter";

const Home: Component<{}> = () => {
  return (
    <main>
      <h1>Hello world!</h1>
      <Counter />
      <p>
        Visit{" "}
        <a href="https://solidjs.com" target="_blank">
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
    </main>
  );
};

export default Home;
