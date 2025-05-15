import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPayrolls,
  generatePayroll,
  updatePayroll
} from '../redux/slices/payrollSlice';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Row,
  Col,
  Statistic
} from 'antd';
import { DollarOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Option } = Select;

const Payroll = () => {
  const dispatch = useDispatch();
  const { payrolls, loading } = useSelector((state) => state.payroll);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchPayrolls({ month: selectedMonth, year: selectedYear }));
  }, [dispatch, selectedMonth, selectedYear]);

  const handleGeneratePayroll = async (values) => {
    try {
      await dispatch(generatePayroll({
        ...values,
        month: selectedMonth,
        year: selectedYear
      })).unwrap();
      message.success('Payroll generated successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Failed to generate payroll');
    }
  };

  const handleUpdatePayroll = async (id, values) => {
    try {
      await dispatch(updatePayroll({ id, ...values })).unwrap();
      message.success('Payroll updated successfully');
    } catch (error) {
      message.error(error.message || 'Failed to update payroll');
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (employee) => employee?.name || 'N/A'
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
      render: (salary) => `$${salary.toFixed(2)}`
    },
    {
      title: 'Allowances',
      dataIndex: 'allowances',
      key: 'allowances',
      render: (allowances) => `$${allowances.toFixed(2)}`
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
      render: (deductions) => `$${deductions.toFixed(2)}`
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
      render: (salary) => `$${salary.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'paid' ? 'green' : 'orange' }}>
          {status.toUpperCase()}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleUpdatePayroll(record._id, { status: 'paid' })}
          disabled={record.status === 'paid'}
        >
          Mark as Paid
        </Button>
      )
    }
  ];

  const totalSalary = payrolls.reduce((sum, payroll) => sum + payroll.netSalary, 0);
  const totalEmployees = payrolls.length;
  const paidCount = payrolls.filter(p => p.status === 'paid').length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payroll Management</h1>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Salary"
              value={totalSalary}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Employees"
              value={totalEmployees}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Paid Salaries"
              value={paidCount}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            style={{ width: 120 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </Option>
            ))}
          </Select>
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 120 }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Option key={i} value={new Date().getFullYear() - 2 + i}>
                {new Date().getFullYear() - 2 + i}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Generate Payroll
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={payrolls}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Generate Payroll"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleGeneratePayroll}
          layout="vertical"
        >
          <Form.Item
            name="employee"
            label="Employee"
            rules={[{ required: true, message: 'Please select an employee' }]}
          >
            <Select placeholder="Select employee">
              {/* Add employee options here */}
            </Select>
          </Form.Item>
          <Form.Item
            name="basicSalary"
            label="Basic Salary"
            rules={[{ required: true, message: 'Please enter basic salary' }]}
          >
            <Input type="number" prefix="$" />
          </Form.Item>
          <Form.Item
            name="allowances"
            label="Allowances"
            rules={[{ required: true, message: 'Please enter allowances' }]}
          >
            <Input type="number" prefix="$" />
          </Form.Item>
          <Form.Item
            name="deductions"
            label="Deductions"
            rules={[{ required: true, message: 'Please enter deductions' }]}
          >
            <Input type="number" prefix="$" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Generate
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Payroll; 