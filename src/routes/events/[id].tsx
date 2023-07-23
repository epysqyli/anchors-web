import { JSX, VoidComponent } from "solid-js";
import { useParams } from "solid-start";

const EventByID: VoidComponent = (): JSX.Element => {
  const params = useParams<{ id: string }>();

  return <>{params.id}</>;
};

export default EventByID;
