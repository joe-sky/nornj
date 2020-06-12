import React, { useEffect } from 'react';
import { Form, Input, Select, Tooltip, Button } from 'antd';
import { observable, toJS } from 'mobx';
import { useObserver } from 'mobx-react-lite';

const { Option } = Select;

class TestStore {
  @observable formDataUser = (
    <MobxFormData>
      <MobxFieldData name="username" required message="Username is required!" />
    </MobxFormData>
  ).formData;

  async getData() {
    await new Promise(resolve => {
      setTimeout(() => {
        this.formDataUser.username = 'Ant Design';
        resolve();
      }, 200);
    });
  }
}

const testStore = new TestStore();

export default props => {
  useEffect(() => {
    testStore.getData();
  }, []);

  return useObserver(() => (
    <div>
      <Form layout="inline">
        <Form.Item label="Username" n-mobxField={testStore.formDataUser.username}>
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
  ));
};
