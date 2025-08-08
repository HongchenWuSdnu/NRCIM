import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modulesRes, indicatorsRes] = await Promise.all([
        axios.get('/api/modules'),
        axios.get('/api/indicators')
      ]);
      setModules(modulesRes.data);
      setIndicators(indicatorsRes.data);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      indicators: record.indicators ? JSON.parse(record.indicators) : [],
      applicable_regions: record.applicable_regions ? JSON.parse(record.applicable_regions) : []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/modules/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        indicators: JSON.stringify(values.indicators || []),
        applicable_regions: JSON.stringify(values.applicable_regions || [])
      };

      if (editingRecord) {
        await axios.put(`/api/modules/${editingRecord.id}`, submitData);
        message.success('更新成功');
      } else {
        await axios.post('/api/modules', submitData);
        message.success('添加成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getIndicatorName = (indicatorId) => {
    const indicator = indicators.find(ind => ind.id === indicatorId);
    return indicator ? indicator.name : indicatorId;
  };

  const columns = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '包含指标',
      dataIndex: 'indicators',
      key: 'indicators',
      render: (indicators) => {
        if (!indicators) return '-';
        const indicatorList = JSON.parse(indicators);
        return indicatorList.length > 0 ? (
          <div>
            {indicatorList.slice(0, 2).map((id, index) => (
              <Tag key={index} color="blue">
                {getIndicatorName(id)}
              </Tag>
            ))}
            {indicatorList.length > 2 && <Tag>+{indicatorList.length - 2}</Tag>}
          </div>
        ) : '-';
      },
    },
    {
      title: '适用区域',
      dataIndex: 'applicable_regions',
      key: 'applicable_regions',
      render: (regions) => {
        if (!regions) return '-';
        const regionList = JSON.parse(regions);
        return regionList.length > 0 ? (
          <div>
            {regionList.slice(0, 2).map((region, index) => (
              <Tag key={index} color="green">
                {region}
              </Tag>
            ))}
            {regionList.length > 2 && <Tag>+{regionList.length - 2}</Tag>}
          </div>
        ) : '-';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const regionOptions = [
    { label: '陆地水面区', value: '陆地水面区' },
    { label: '植被覆盖区', value: '植被覆盖区' },
    { label: '裸地区', value: '裸地区' },
    { label: '冰川-冻土区', value: '冰川-冻土区' },
    { label: '过渡区', value: '过渡区' },
    { label: '海岸区', value: '海岸区' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="模块管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加模块
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={modules}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingRecord ? '编辑模块' : '添加模块'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="模块名称"
            rules={[{ required: true, message: '请输入模块名称' }]}
          >
            <Input placeholder="请输入模块名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="indicators"
            label="包含指标"
          >
            <Select
              mode="multiple"
              placeholder="请选择指标"
              optionFilterProp="children"
            >
              {indicators.map(indicator => (
                <Option key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="applicable_regions"
            label="适用区域"
          >
            <Select
              mode="multiple"
              placeholder="请选择适用区域"
              options={regionOptions}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? '更新' : '添加'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Modules; 