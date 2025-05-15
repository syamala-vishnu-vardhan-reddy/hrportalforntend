import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Tabs,
  Avatar,
  Row,
  Col,
  Divider
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UploadOutlined,
  LockOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        country: user.address?.country || '',
        zipCode: user.address?.zipCode || '',
        department: user.department,
        position: user.position
      });
    }
  }, [user, form]);

  const handleUpdateProfile = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'avatar' && values[key]?.file) {
          formData.append('avatar', values[key].file);
        } else if (key.startsWith('address')) {
          // Handle address fields
          const addressKey = key.replace('address.', '');
          formData.append(`address[${addressKey}]`, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      await dispatch(updateProfile(formData)).unwrap();
      message.success('Profile updated successfully');
    } catch (error) {
      message.error(error.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await dispatch(updateProfile({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })).unwrap();
      message.success('Password updated successfully');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.message || 'Failed to update password');
    }
  };

  const uploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      return isImage && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        setAvatar(URL.createObjectURL(info.file.originFileObj));
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'Not set';
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
      address.zipCode
    ].filter(Boolean);
    return parts.join(', ') || 'Not set';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div className="text-center">
              <Upload {...uploadProps}>
                <div className="relative">
                  <Avatar
                    size={120}
                    src={avatar || user?.avatar}
                    icon={<UserOutlined />}
                  />
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                    <UploadOutlined />
                  </div>
                </div>
              </Upload>
              <h2 className="mt-4 text-xl font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500">{user?.position}</p>
              <p className="text-gray-500">{user?.department}</p>
            </div>
            <Divider />
            <div className="space-y-2">
              <p><MailOutlined /> {user?.email}</p>
              <p><PhoneOutlined /> {user?.phone || 'Not set'}</p>
              <p><EnvironmentOutlined /> {formatAddress(user?.address)}</p>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Personal Information" key="1">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true }]}
                      >
                        <Input prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true }]}
                      >
                        <Input prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                          { required: true },
                          { type: 'email' }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Phone"
                      >
                        <Input prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider>Address</Divider>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="street"
                        label="Street"
                      >
                        <Input prefix={<EnvironmentOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="city"
                        label="City"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="state"
                        label="State/Province"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="country"
                        label="Country"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="zipCode"
                        label="ZIP/Postal Code"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane tab="Change Password" key="2">
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true }]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true },
                      { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Change Password
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile; 