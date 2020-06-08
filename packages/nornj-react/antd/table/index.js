import { registerComponent } from 'nornj';
import { Table } from 'antd';

const { Column, ColumnGroup } = Table;
registerComponent({
  'ant-Table': Table,
  'ant-TableColumn': Column,
  'ant-TableColumnGroup': ColumnGroup
});

export default Table;
