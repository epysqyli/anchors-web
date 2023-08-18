import { JSX, VoidComponent } from "solid-js";
import { useParams } from "solid-start";

const UserPage: VoidComponent = (): JSX.Element => {
  const params = useParams<{ id: string }>();

  return <>{params.id}</>;
};

export default UserPage;
