import { render } from "@solidjs/testing-library";
import { describe } from "vitest";
import MyPosts from "~/routes/my-posts";

describe("<MyPosts />", () => {
  it("shows the correct title", async () => {
    const { unmount, getByText } = render(() => <MyPosts />);
    const title = getByText("Your nostr posts") as HTMLHeadingElement;
    expect(title).toBeInTheDocument();

    unmount();
  });
});
