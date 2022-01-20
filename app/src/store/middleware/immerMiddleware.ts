/* eslint-disable indent */
import produce, { Draft } from 'immer';
import { GetState, SetState, State, StateCreator, StoreApi } from 'zustand';

export const im =
  <
    T extends State,
    CustomSetState extends SetState<T>,
    CustomGetState extends GetState<T>,
    CustomStoreApi extends StoreApi<T>,
  >(
    config: StateCreator<T>,
  ): StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi> =>
  (set, get, api) =>
    config(
      (partial, replace) => {
        const nextState =
          typeof partial === 'function'
            ? produce(partial as (state: Draft<T>) => T)
            : (partial as T);

        return set(nextState, replace);
      },
      get,
      api,
    );
