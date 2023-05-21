import Counter from "./Counter";
import { fireEvent, render } from "@solidjs/testing-library";

describe("<Counter />", () => {
  it("increments value", async () => {
    const { findByRole, unmount } = render(() => <Counter />);
    const button = (await findByRole("button")) as HTMLButtonElement;
    expect(button).toBeInTheDocument();

    expect(button).toHaveTextContent(/Clicks: 0/);

    fireEvent.click(button);
    expect(button).toHaveTextContent(/Clicks: 1/);

    unmount();
  });

  it("renders 1", () => {
    const { container, unmount } = render(() => <Counter />);
    expect(container).toMatchSnapshot();
    unmount();
  });
});
