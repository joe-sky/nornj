import React, { useEffect } from 'react';
import { Form, Input, Select, Tooltip, Button } from 'antd';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

const { Option } = Select;

class TestStore {
  @observable formDataUser = (
    <mobxFormData>
      <mobxFieldData name="username" required message="Username is required!" />
    </mobxFormData>
  ).formData;

  async getData() {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        this.formDataUser.username = 'Ant Design';
        resolve();
      }, 200);
    });
  }
}

const testStore = new TestStore();

export default observer(props => {
  useEffect(() => {
    testStore.getData();
  }, []);

  return (
    <div>
      <Form layout="inline">
        <Form.Item label="Username" mobxField={testStore.formDataUser.username}>
          <Input />
        </Form.Item>
      </Form>
      <pre className="language-bash">
        {JSON.stringify(
          toJS(testStore.formDataUser.fieldDatas.get('username')),
          (k, v) => {
            if (['__self', 'validatorSchema'].includes(k)) {
              return undefined;
            }
            return v;
          },
          2
        )}
      </pre>
    </div>
  );
});
