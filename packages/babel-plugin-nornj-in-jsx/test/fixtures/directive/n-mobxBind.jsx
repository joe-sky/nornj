import React from 'react';
import { useLocalStore } from 'mobx-react-lite';

export const MobxBindTest = () => {
  const state = useLocalStore(() => ({
    inputValue: 'test'
  }));

  const inputValue = 'inputValue';

  return <input n-mobxBind={`state[inputValue]`} />;
};
