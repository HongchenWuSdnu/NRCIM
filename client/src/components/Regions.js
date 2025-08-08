import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const Regions = () => {
  const [regions, setRegions] = useState([]);
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
      const [regionsRes, indicatorsRes] = await Promise.all([
        axios.get('/api/regions'),
        axios.get('/api/indicators')
      ]);
      setRegions(regionsRes.data);
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
      characteristics: record.characteristics ? JSON.parse(record.characteristics) : {},
      indicators: record.indicators ? JSON.parse(record.indicators) : []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/regions/${id}`);
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
        characteristics: JSON.stringify(values.characteristics || {}),
        indicators: JSON.stringify(values.indicators || [])
      };

      if (editingRecord) {
        await axios.put(`/api/regions/${editingRecord.id}`, submitData);
        message.success('更新成功');
      } else {
        await axios.post('/api/regions', submitData);
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
      title: '区域名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '区域类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '特征参数',
      dataIndex: 'characteristics',
      key: 'characteristics',
      render: (characteristics) => {
        if (!characteristics) return '-';
        const chars = JSON.parse(characteristics);
        return Object.keys(chars).length > 0 ? (
          <div>
            {Object.entries(chars).slice(0, 2).map(([key, value]) => (
              <Tag key={key} color="green">
                {key}: {value}
              </Tag>
            ))}
            {Object.keys(chars).length > 2 && <Tag>+{Object.keys(chars).length - 2}</Tag>}
          </div>
        ) : '-';
      },
    },
    {
      title: '指标集',
      dataIndex: 'indicators',
      key: 'indicators',
      render: (indicators) => {
        if (!indicators) return '-';
        const indicatorList = JSON.parse(indicators);
        return indicatorList.length > 0 ? (
          <div>
            {indicatorList.slice(0, 2).map((id, index) => (
              <Tag key={index} color="orange">
                {getIndicatorName(id)}
              </Tag>
            ))}
            {indicatorList.length > 2 && <Tag>+{indicatorList.length - 2}</Tag>}
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

  const regionTypes = [
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
        title="区域管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加区域
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={regions}
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
        title={editingRecord ? '编辑区域' : '添加区域'}
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
            label="区域名称"
            rules={[{ required: true, message: '请输入区域名称' }]}
          >
            <Input placeholder="请输入区域名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="区域类型"
            rules={[{ required: true, message: '请选择区域类型' }]}
          >
            <Select placeholder="请选择区域类型">
              {regionTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="characteristics"
            label="特征参数"
          >
            <TextArea rows={4} placeholder="请输入特征参数（JSON格式）" />
          </Form.Item>

          <Form.Item
            name="indicators"
            label="指标集"
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

export default Regions; 