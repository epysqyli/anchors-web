import { VoidComponent } from "solid-js";
import { TbUsersGroup } from "solid-icons/tb";
import { BsLightningChargeFill } from "solid-icons/bs";
import SettingsLink from "~/components/settings/SettingsLink";
import { RiBusinessProfileLine, RiMapSignalTowerFill } from "solid-icons/ri";

const Settings: VoidComponent = () => {
  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage your nostr profile
      </h1>

      <div class='overflow-y-scroll custom-scrollbar h-4/5'>
        <div class='grid grid-cols-3 w-4/5 mx-auto px-5 gap-x-5 gap-y-10 mt-20'>
          <SettingsLink href='user-metadata' content='set or update your profile info'>
            <RiBusinessProfileLine class='mx-auto' size={62} />
          </SettingsLink>

          <SettingsLink href='/settings/manage-relays' content='manage relays'>
            <RiMapSignalTowerFill class='mx-auto' size={62} />
          </SettingsLink>

          <SettingsLink href='/settings/manage-following' content='manage your following'>
            <TbUsersGroup class='mx-auto' size={62} />
          </SettingsLink>

          <SettingsLink href='/' content='set your lightning address?'>
            <BsLightningChargeFill class='mx-auto' size={62} />
          </SettingsLink>
        </div>
      </div>
    </>
  );
};

export default Settings;
