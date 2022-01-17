import axios from 'axios';
import React, { FC } from 'react';
import Onboarding from 'react-native-onboarding-swiper';

import LazyIcon from '../../../../assets/images/lazy_lounge.svg';
import OopsieWord from '../../../../assets/images/oopsie_word.svg';
import Phone from '../../../../assets/images/phone.svg';
import Question from '../../../../assets/images/what.svg';
import { useContacts, useCustomTheme } from '../../../hooks';
import { isAxiosError, parsedAxiosError } from '../../../lib';
import * as api from '../../../sdk';
import { useStore } from '../../../store';

export const OnboardScreen: FC = () => {
  const {
    theme: { colors },
  } = useCustomTheme();

  useContacts();
  const updateUserValues = useStore(state => state.updateUserValues);
  const setIsOnboarding = useStore(state => state.setIsOnboarding);

  const handleDone = async () => {
    try {
      const update = { newUser: false };
      const config = api.user.update({ update });

      const { data } = await axios.request(config);

      console.log({ data });
      setIsOnboarding(data.newUser);

      updateUserValues(data);
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(parsedAxiosError(err).error);
      }
    }
  };

  return (
    <Onboarding
      titleStyles={{ color: colors.secondary }}
      onDone={handleDone}
      pages={[
        {
          backgroundColor: colors.background,
          image: <OopsieWord width={290} height={290} />,
          title: '',
          subtitle: ``,
          titleStyles: { color: 'red' },
        },
        {
          backgroundColor: colors.background,
          image: <LazyIcon width={180} height={180} />,
          title: 'Trip Check',
          subtitle: `Checklist that detects when you're about to
          leave so it can remind you to Triple Check your list.`,
        },
        {
          backgroundColor: colors.background,
          image: <Question width={180} height={180} />,
          title: 'Whos Who',
          subtitle: `A fully customizable contact management tool
          that will detect likely candidates with names you're bound
          to forget. Keeps revolving inventory of your recent interactions
          placing them at the palm of your hand.`,
        },
        {
          backgroundColor: colors.background,
          image: <Phone width={180} height={180} />,
          title: '800 My Phone',
          subtitle: `Always have access to your contacts for those
          scary situations where your phone died, internets
          down, and you need to make an important phone
          call, but...

          Who remember's phone numbers nowadays?
          `,
        },
      ]}
    />
  );
};
