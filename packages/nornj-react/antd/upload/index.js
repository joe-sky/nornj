import { registerComponent } from 'nornj';
import { Upload } from 'antd';

registerComponent({
  'ant-Upload': {
    component: Upload,
    options: {
      getValueFromEvent: e => {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
      }
    }
  }
});

export default Upload;
