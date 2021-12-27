import React, { FC, useEffect } from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { useContacts } from '../../../hooks';

interface Steps {
  label: string;
  status: 'checked' | 'unchecked' | 'indeterminate';
}

const stepsRemaining: Steps[] = [
  {
    label: 'Account Created',
    status: 'checked',
  },
  {
    label: 'Verified Mobile Number',
    status: 'checked',
  },
  {
    label: 'Selected 4 Digit Pin',
    status: 'checked',
  },
  {
    label: 'Contacts Synced',
    status: 'indeterminate',
  },
];

export const Activity: FC = () => {
  const { handlePermissions, permissions } = useContacts();

  useEffect(() => {
    handlePermissions();
  }, [permissions]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 18, paddingTop: 16, fontWeight: '500' }}>
        Current Progress
      </Text>
      {stepsRemaining.map(step => (
        <View
          key={step.label}
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 16,
          }}
        >
          <CheckBox
            key={step.label}
            style={{
              borderWidth: 1,
              borderColor: '#BBBBBB',
              backgroundColor: '#EEEEEE',
              width: '95%',
            }}
          />
        </View>
      ))}
    </View>
  );
};
