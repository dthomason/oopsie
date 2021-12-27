import { useState } from 'react';
import Contacts, { Contact } from 'react-native-contacts';
import shallow from 'zustand/shallow';

import { useStore } from '../store';

export interface UseContacts {
  permissions: Permissions;
  handlePermissions: () => void;
}

export const useContacts = () => {
  const [permissions, setPermissions] = useStore(
    state => [state.permissions, state.setPermissions],
    shallow,
  );
  const [contacts, setContacts] = useState<Contact[]>();

  const handlePermissions = async (): Promise<void> => {
    try {
      const response = await Contacts.checkPermission();

      setPermissions(response);
      const results = await Contacts.getAll();

      setTimeout(() => setContacts(results), 8000);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    permissions,
    handlePermissions,
  };
};
