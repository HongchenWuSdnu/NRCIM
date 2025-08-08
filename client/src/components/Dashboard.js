import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress } from 'antd';
import { 
  DatabaseOutlined, 
  BarChartOutlined, 
  EnvironmentOutlined,
  EyeOutlined 
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    total_observations: 0,
    total_indicators: 0,
    total_regions: 0
  });
  const [recentObservations, setRecentObservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, observationsRes] = await Promise.all([
        axios.get('/api/statistics'),
        axios.get('/api/observations')
      ]);
      
      setStatistics(statsRes.data);
      setRecentObservations(observationsRes.data.slice(0, 10));
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOption = {
    title: {
      text: '资源类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '资源类型',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 25, name: '气候资源' },
          { value: 30, name: '地表覆盖' },
          { value: 20, name: '水资源' },
          { value: 25, name: '土地资源' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const recentObservationsColumns = [
    {
      title: '观测时间',
      dataIndex: 'observation_time',
      key: 'observation_time',
      render: (text) => new Date(text).toLocaleString('zh-CN')
    },
    {
      title: '区域',
      dataIndex: 'region_name',
      key: 'region_name'
    },
    {
      title: '资源类型',
      dataIndex: 'resource_type_name',
      key: 'resource_type_name'
    },
    {
      title: '指标',
      dataIndex: 'indicator_name',
      key: 'indicator_name'
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => `${value} ${record.unit || ''}`
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>系统概览</h2>
      
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总观测数据"
              value={statistics.total_observations}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="指标体系"
              value={statistics.total_indicators}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="区域数量"
              value={statistics.total_regions}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="资源类型"
              value={4}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card title="资源类型分布" style={{ height: '400px' }}>
            <ReactECharts option={chartOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统状态" style={{ height: '400px' }}>
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>数据完整性</span>
                  <span>85%</span>
                </div>
                <Progress percent={85} status="active" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>系统性能</span>
                  <span>92%</span>
                </div>
                <Progress percent={92} status="active" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>数据准确性</span>
                  <span>78%</span>
                </div>
                <Progress percent={78} status="active" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="最近观测数据">
        <Table
          columns={recentObservationsColumns}
          dataSource={recentObservations}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Dashboard; 