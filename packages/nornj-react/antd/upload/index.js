import { registerComponent } from 'nornj';
import { Upload } from 'antd';

const options = {
  valuePropName: 'fileList',
  getValueFromEvent: e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  },
  fieldDefaultRule: {
    type: 'array'
  }
};

registerComponent({
  'ant-Upload': {
    component: Upload,
    options
  },
  'ant-UploadDragger': {
    component: Upload.Dragger,
    options
  }
});

export default Upload;
