import { Component } from "solid-js";
import { BsBook } from "solid-icons/bs";
import { RiLogosSpotifyLine } from "solid-icons/ri";
import { BiRegularCameraMovie } from "solid-icons/bi";
import { AiOutlineYoutube, AiOutlineLink } from "solid-icons/ai";

const RefsSearch: Component<{}> = (props) => {
  return (
    <div class="flex items-center justify-around">
      <div>
        <BsBook size={26} />
      </div>
      <div>
        <AiOutlineYoutube size={26} />
      </div>
      <div>
        <BiRegularCameraMovie size={26} />
      </div>
      <div>
        <RiLogosSpotifyLine size={26} />
      </div>
      <div>
        <AiOutlineLink size={26} />
      </div>
    </div>
  );
};

export default RefsSearch;
