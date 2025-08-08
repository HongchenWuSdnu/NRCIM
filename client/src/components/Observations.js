import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;

const Observations = () => {
  const [observations, setObservations] = useState([]);
  const [regions, setRegions] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
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
      const [observationsRes, regionsRes, resourceTypesRes, indicatorsRes] = await Promise.all([
        axios.get('/api/observations'),
        axios.get('/api/regions'),
        axios.get('/api/resource-types'),
        axios.get('/api/indicators')
      ]);
      setObservations(observationsRes.data);
      setRegions(regionsRes.data);
      setResourceTypes(resourceTypesRes.data);
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
      observation_time: record.observation_time ? moment(record.observation_time) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/observations/${id}`);
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
        observation_time: values.observation_time ? values.observation_time.format('YYYY-MM-DD HH:mm:ss') : null
      };

      if (editingRecord) {
        await axios.put(`/api/observations/${editingRecord.id}`, submitData);
        message.success('更新成功');
      } else {
        await axios.post('/api/observations', submitData);
        message.success('添加成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: '观测时间',
      dataIndex: 'observation_time',
      key: 'observation_time',
      render: (text) => text ? new Date(text).toLocaleString('zh-CN') : '-',
    },
    {
      title: '区域',
      dataIndex: 'region_name',
      key: 'region_name',
    },
    {
      title: '资源类型',
      dataIndex: 'resource_type_name',
      key: 'resource_type_name',
    },
    {
      title: '指标',
      dataIndex: 'indicator_name',
      key: 'indicator_name',
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => `${value} ${record.unit || ''}`,
    },
    {
      title: '采集方式',
      dataIndex: 'collection_method',
      key: 'collection_method',
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

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="观测数据管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加观测数据
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={observations}
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
        title={editingRecord ? '编辑观测数据' : '添加观测数据'}
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
            name="observation_time"
            label="观测时间"
            rules={[{ required: true, message: '请选择观测时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择观测时间"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="region_id"
            label="区域"
            rules={[{ required: true, message: '请选择区域' }]}
          >
            <Select placeholder="请选择区域">
              {regions.map(region => (
                <Option key={region.id} value={region.id}>
                  {region.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="resource_type_id"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select placeholder="请选择资源类型">
              {resourceTypes.map(type => (
                <Option key={type.id} value={type.id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="indicator_id"
            label="指标"
            rules={[{ required: true, message: '请选择指标' }]}
          >
            <Select placeholder="请选择指标">
              {indicators.map(indicator => (
                <Option key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="数值"
            rules={[{ required: true, message: '请输入数值' }]}
          >
            <InputNumber
              placeholder="请输入数值"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="unit"
            label="单位"
          >
            <Input placeholder="请输入单位" />
          </Form.Item>

          <Form.Item
            name="collection_method"
            label="采集方式"
          >
            <Select placeholder="请选择采集方式">
              <Option value="自动监测">自动监测</Option>
              <Option value="人工观测">人工观测</Option>
              <Option value="遥感监测">遥感监测</Option>
              <Option value="实地调查">实地调查</Option>
            </Select>
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

export default Observations; 