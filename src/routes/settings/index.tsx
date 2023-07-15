import { VoidComponent } from "solid-js";
import { BsLightningChargeFill } from "solid-icons/bs";
import SettingsLink from "~/components/settings/SettingsLink";
import { RiBusinessProfileLine, RiMapSignalTowerFill } from "solid-icons/ri";

const Settings: VoidComponent = () => {
  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage your nostr profile
      </h1>
      <div class='grid grid-cols-2 w-2/3 h-1/2 mx-auto gap-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <SettingsLink href='user-metadata' content='set or update your profile info'>
          <RiBusinessProfileLine class='mx-auto' size={62} />
        </SettingsLink>

        <SettingsLink href='/' content='manage relays'>
          <RiMapSignalTowerFill class='mx-auto' size={62} />
        </SettingsLink>

        <SettingsLink href='/' content='set your lightning address?'>
          <BsLightningChargeFill class='mx-auto' size={62} />
        </SettingsLink>

        <SettingsLink href='/' content='additional options?' />
      </div>
    </>
  );
};

export default Settings;
