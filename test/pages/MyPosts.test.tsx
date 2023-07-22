import { describe, it } from "vitest";
import MyPosts from "~/routes/my-posts";
import { render } from "@solidjs/testing-library";

describe("<MyPosts />", () => {
  it("shows the correct title", async () => {
    const { unmount, getByText } = render(() => <MyPosts />);
    const title = getByText("Your nostr posts") as HTMLHeadingElement;
    expect(title).toBeInTheDocument();

    unmount();
  });

  it.skip("shows all fetched events", async () => {
    const { unmount, findByText } = render(() => <MyPosts />);

    expect(await findByText("Just some new event") as HTMLDivElement).toBeInTheDocument();

    unmount();
  });
});
