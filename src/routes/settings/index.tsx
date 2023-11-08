import { RelayContext } from "~/contexts/relay";
import { VoidComponent, useContext } from "solid-js";
import { TbStack2, TbUsersGroup } from "solid-icons/tb";
import SettingsLink from "~/components/settings/SettingsLink";
import { RiBusinessProfileLine, RiMapSignalTowerFill, RiOthersKey2Line } from "solid-icons/ri";

const Settings: VoidComponent = () => {
  const { authMode } = useContext(RelayContext);

  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold py-5 xl:py-10'>
        Manage your nostr profile
      </h1>

      <div class='overflow-y-scroll xl:custom-scrollbar h-3/4 w-11/12 xl:h-5/6 xl:w-5/6 mx-auto'>
        <div class='grid grid-cols-1 xl:grid-cols-3 w-4/5 mx-auto px-5 gap-x-5 gap-y-2 xl:gap-y-10 xl:mt-20'>
          <SettingsLink href='user-metadata' content='update your profile info'>
            <RiBusinessProfileLine class='mx-auto' size={62} />
          </SettingsLink>

          <SettingsLink href='/settings/manage-relays' content='manage relays'>
            <RiMapSignalTowerFill class='mx-auto' size={62} />
          </SettingsLink>

          <SettingsLink href='/settings/manage-following' content='manage your following'>
            <TbUsersGroup class='mx-auto' size={62} />
          </SettingsLink>

          <SettingsLink href='/my-posts' content='my posts'>
            <TbStack2 class='mx-auto' size={60} />
          </SettingsLink>

          {authMode.get() != "private" ? (
            <SettingsLink href='/settings/update-guest-public-key' content='update guest public key'>
              <RiOthersKey2Line class='mx-auto' size={60} />
            </SettingsLink>
          ) : (
            <></>
          )}

          {/* <SettingsLink href='/settings' content='saved posts'>
            <FiSave class='mx-auto' size={60} />
          </SettingsLink>

          <SettingsLink href='/settings' content='set your lightning address?'>
            <BsLightningChargeFill class='mx-auto' size={62} />
          </SettingsLink> */}
        </div>
      </div>
    </>
  );
};

export default Settings;
