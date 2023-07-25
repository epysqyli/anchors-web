import { render } from "@solidjs/testing-library";
import Write from "~/routes/write";

describe("<Write />", () => {
  it.skip("shows up", async () => {
    const { unmount, findByText } = render(() => <Write />);
    const title = (await findByText("Write a new idea")) as HTMLDivElement;
    expect(title).toBeInTheDocument();

    unmount();
  });
});
