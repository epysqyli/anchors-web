import { VoidComponent } from "solid-js";
import SettingsLink from "~/components/settings/SettingsLink";

const Settings: VoidComponent = (props) => {
  return (
    <>
      <h1 class='text-slate-100 text-center text-2xl md:text-4xl font-bold mt-14'>
        Manage your nostr profile
      </h1>
      <div class='grid grid-cols-2 w-2/3 h-1/2 mx-auto gap-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <SettingsLink href='user-metadata' content='set or update your profile info' />
        <SettingsLink href='/' content='manage relays' />
        <SettingsLink href='/' content='set your lightning address?' />
        <SettingsLink href='/' content='something else?' />
      </div>
    </>
  );
};

export default Settings;
