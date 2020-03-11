import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import Form from 'nornj-react/antd/lib/form';
import Input from 'nornj-react/antd/lib/input';

export const MobxFieldTest = () => {
  const { formData } = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" />
    </MobxFormData>
  ));

  return (
    <Form.Item className="field1" n-mobxField-noBind={formData.userName}>
      <Input n-mobxBind={formData.userName} />
      <Input />
    </Form.Item>
  );
};
