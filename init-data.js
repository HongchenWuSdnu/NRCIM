const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const db = new sqlite3.Database('./natural_resources.db');

// 初始化示例数据
const initData = () => {
  console.log('开始初始化NRCIM示例数据...');

  // 根据NRCIM方法插入详细的指标体系
  const sampleIndicators = [
    // 气候资源指标
    // 一级指标 - 资源数量
    {
      id: uuidv4(),
      name: '年降水总量',
      level: 1,
      resource_type_id: 'climate',
      description: '反映气候资源中水分资源的数量',
      source_type: '正演',
      unit: 'mm'
    },
    {
      id: uuidv4(),
      name: '年太阳辐射总量',
      level: 1,
      resource_type_id: 'climate',
      description: '反映光能热量资源的数量',
      source_type: '正演',
      unit: 'MJ/m²'
    },
    {
      id: uuidv4(),
      name: '年风能密度',
      level: 1,
      resource_type_id: 'climate',
      description: '反映风能资源的数量',
      source_type: '正演',
      unit: 'W/m²'
    },
    // 二级指标 - 资源质量
    {
      id: uuidv4(),
      name: '降水变异系数',
      level: 2,
      resource_type_id: 'climate',
      description: '反映降水资源的稳定性',
      source_type: '正演',
      unit: '无量纲'
    },
    {
      id: uuidv4(),
      name: '大气CO2浓度',
      level: 2,
      resource_type_id: 'climate',
      description: '反映大气成分资源质量',
      source_type: '正演',
      unit: 'ppm'
    },
    // 三级指标 - 可直接观测
    {
      id: uuidv4(),
      name: '日均气温',
      level: 3,
      resource_type_id: 'climate',
      description: '可直接观测的温度指标',
      source_type: '正演',
      unit: '°C'
    },
    {
      id: uuidv4(),
      name: '相对湿度',
      level: 3,
      resource_type_id: 'climate',
      description: '可直接观测的湿度指标',
      source_type: '正演',
      unit: '%'
    },
    
    // 地表覆盖资源指标
    {
      id: uuidv4(),
      name: '森林覆盖率',
      level: 1,
      resource_type_id: 'surface_cover',
      description: '林木资源数量指标',
      source_type: '反演',
      unit: '%'
    },
    {
      id: uuidv4(),
      name: '草地生产力',
      level: 2,
      resource_type_id: 'surface_cover',
      description: '草地资源质量指标',
      source_type: '反演',
      unit: 'kg/hm²'
    },
    {
      id: uuidv4(),
      name: '作物产量',
      level: 3,
      resource_type_id: 'surface_cover',
      description: '作物资源产量指标',
      source_type: '反演',
      unit: 'kg/hm²'
    },
    
    // 水资源指标
    {
      id: uuidv4(),
      name: '地表水储量',
      level: 1,
      resource_type_id: 'water',
      description: '地表水资源数量',
      source_type: '正演',
      unit: '万m³'
    },
    {
      id: uuidv4(),
      name: '水质指数',
      level: 2,
      resource_type_id: 'water',
      description: '水资源质量评价',
      source_type: '正演',
      unit: '无量纲'
    },
    {
      id: uuidv4(),
      name: '冰川面积',
      level: 3,
      resource_type_id: 'water',
      description: '冰川资源面积',
      source_type: '反演',
      unit: 'km²'
    },
    
    // 土地资源指标
    {
      id: uuidv4(),
      name: '耕地面积',
      level: 1,
      resource_type_id: 'land',
      description: '农用地数量指标',
      source_type: '正演',
      unit: 'hm²'
    },
    {
      id: uuidv4(),
      name: '土壤有机质含量',
      level: 2,
      resource_type_id: 'land',
      description: '土地资源质量指标',
      source_type: '正演',
      unit: 'g/kg'
    },
    {
      id: uuidv4(),
      name: '冻土层厚度',
      level: 3,
      resource_type_id: 'land',
      description: '冻土资源特征指标',
      source_type: '正演',
      unit: 'm'
    }
  ];

  sampleIndicators.forEach(indicator => {
    db.run(`INSERT OR IGNORE INTO indicators (id, name, level, resource_type_id, description, source_type, unit) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [indicator.id, indicator.name, indicator.level, indicator.resource_type_id, indicator.description, indicator.source_type, indicator.unit]);
  });

  // 按照NRCIM方法插入6大类区域模块集示例
  const sampleRegions = [
    {
      id: uuidv4(),
      name: '长江中下游陆地水面区',
      type: '陆地水面区',
      characteristics: JSON.stringify({
        '地形特征': '河流湖泊密布的平原地区',
        '气候类型': '亚热带季风气候',
        '水系特点': '河网密集，湖泊众多',
        '主要功能': '水资源调节、生态服务'
      }),
      indicators: JSON.stringify([sampleIndicators[0].id, sampleIndicators[11].id, sampleIndicators[12].id])
    },
    {
      id: uuidv4(),
      name: '东北大兴安岭植被覆盖区',
      type: '植被覆盖区',
      characteristics: JSON.stringify({
        '植被类型': '温带针叶林',
        '气候条件': '温带大陆性气候',
        '土壤类型': '棕壤、暗棕壤',
        '生态功能': '碳汇、生物多样性保护'
      }),
      indicators: JSON.stringify([sampleIndicators[7].id, sampleIndicators[8].id, sampleIndicators[9].id])
    },
    {
      id: uuidv4(),
      name: '内蒙古高原裸地区',
      type: '裸地区',
      characteristics: JSON.stringify({
        '地貌类型': '高原丘陵',
        '植被稀少': '草原向荒漠过渡',
        '土壤特征': '栗钙土、棕钙土',
        '气候干旱': '年降水量200-400mm'
      }),
      indicators: JSON.stringify([sampleIndicators[0].id, sampleIndicators[3].id, sampleIndicators[14].id])
    },
    {
      id: uuidv4(),
      name: '青藏高原冰川-冻土区',
      type: '冰川-冻土区',
      characteristics: JSON.stringify({
        '海拔高度': '平均海拔4000m以上',
        '冻土类型': '多年冻土、季节冻土',
        '冰川分布': '现代冰川发育',
        '气候特征': '高寒气候'
      }),
      indicators: JSON.stringify([sampleIndicators[13].id, sampleIndicators[15].id, sampleIndicators[1].id])
    },
    {
      id: uuidv4(),
      name: '黄河三角洲过渡区',
      type: '过渡区',
      characteristics: JSON.stringify({
        '生态类型': '河口湿地系统',
        '地貌特征': '三角洲平原',
        '水盐条件': '淡水与海水交汇',
        '生态价值': '候鸟栖息地、生物多样性'
      }),
      indicators: JSON.stringify([sampleIndicators[11].id, sampleIndicators[12].id, sampleIndicators[7].id])
    },
    {
      id: uuidv4(),
      name: '渤海湾海岸区',
      type: '海岸区',
      characteristics: JSON.stringify({
        '海岸类型': '淤泥质海岸',
        '潮汐特征': '正规半日潮',
        '生态系统': '海岸带湿地',
        '资源特色': '海洋渔业、盐业资源'
      }),
      indicators: JSON.stringify([sampleIndicators[12].id, sampleIndicators[8].id, sampleIndicators[0].id])
    }
  ];

  sampleRegions.forEach(region => {
    db.run(`INSERT OR IGNORE INTO regions (id, name, type, characteristics, indicators) VALUES (?, ?, ?, ?, ?)`,
      [region.id, region.name, region.type, region.characteristics, region.indicators]);
  });

  // 按照NRCIM方法插入归类模块和赋能模块
  const sampleModules = [
    // 归类模块 - 资源数量质量模块
    {
      id: uuidv4(),
      name: '气候资源数量质量模块',
      description: '整合气候资源的数量和质量指标，包括水分、光能热量、风能和大气成分资源',
      indicators: JSON.stringify([sampleIndicators[0].id, sampleIndicators[1].id, sampleIndicators[2].id, sampleIndicators[3].id, sampleIndicators[4].id]),
      applicable_regions: JSON.stringify(['陆地水面区', '植被覆盖区', '裸地区', '冰川-冻土区', '过渡区', '海岸区'])
    },
    {
      id: uuidv4(),
      name: '地表覆盖资源模块',
      description: '涵盖林木、草、作物等地表覆盖资源的综合评价模块',
      indicators: JSON.stringify([sampleIndicators[7].id, sampleIndicators[8].id, sampleIndicators[9].id]),
      applicable_regions: JSON.stringify(['植被覆盖区', '过渡区', '裸地区'])
    },
    {
      id: uuidv4(),
      name: '水资源综合模块',
      description: '整合地表水、冰川、海面和地下水资源的观测指标',
      indicators: JSON.stringify([sampleIndicators[10].id, sampleIndicators[11].id, sampleIndicators[12].id]),
      applicable_regions: JSON.stringify(['陆地水面区', '冰川-冻土区', '过渡区', '海岸区'])
    },
    {
      id: uuidv4(),
      name: '土地资源质量模块',
      description: '包含农用地和未利用地的土地资源评价指标',
      indicators: JSON.stringify([sampleIndicators[13].id, sampleIndicators[14].id, sampleIndicators[15].id]),
      applicable_regions: JSON.stringify(['植被覆盖区', '裸地区', '冰川-冻土区'])
    },
    
    // 资源间相互作用过程模块
    {
      id: uuidv4(),
      name: '资源间相互作用过程模块',
      description: '反映不同资源间通过物理、化学、生物等作用实现能量和物质交换过程',
      indicators: JSON.stringify([sampleIndicators[5].id, sampleIndicators[6].id, sampleIndicators[3].id, sampleIndicators[11].id]),
      applicable_regions: JSON.stringify(['陆地水面区', '植被覆盖区', '过渡区'])
    },
    
    // 赋能模块 - 资源管理决策支撑
    {
      id: uuidv4(),
      name: '自然资源资产化管理赋能模块',
      description: '服务于自然资源资产化管理的功能模块，支撑资源价值评估和管理决策',
      indicators: JSON.stringify([sampleIndicators[0].id, sampleIndicators[7].id, sampleIndicators[10].id, sampleIndicators[13].id]),
      applicable_regions: JSON.stringify(['陆地水面区', '植被覆盖区', '海岸区'])
    },
    {
      id: uuidv4(),
      name: '生态系统平衡研究赋能模块',
      description: '支撑资源系统平衡相关科学研究的功能模块',
      indicators: JSON.stringify([sampleIndicators[4].id, sampleIndicators[8].id, sampleIndicators[11].id, sampleIndicators[14].id]),
      applicable_regions: JSON.stringify(['植被覆盖区', '过渡区', '冰川-冻土区'])
    },
    {
      id: uuidv4(),
      name: '资源状态预测赋能模块',
      description: '用于预判未来资源状态模型模拟的功能模块',
      indicators: JSON.stringify([sampleIndicators[2].id, sampleIndicators[3].id, sampleIndicators[9].id, sampleIndicators[12].id]),
      applicable_regions: JSON.stringify(['陆地水面区', '植被覆盖区', '裸地区', '海岸区'])
    }
  ];

  sampleModules.forEach(module => {
    db.run(`INSERT OR IGNORE INTO modules (id, name, description, indicators, applicable_regions) VALUES (?, ?, ?, ?, ?)`,
      [module.id, module.name, module.description, module.indicators, module.applicable_regions]);
  });

  // 插入符合NRCIM方法的观测数据示例
  const sampleObservations = [
    // 长江中下游陆地水面区观测数据
    {
      id: uuidv4(),
      observation_time: '2024-01-15 10:00:00',
      region_id: sampleRegions[0].id,
      resource_type_id: 'climate',
      indicator_id: sampleIndicators[0].id, // 年降水总量
      value: 1200,
      unit: 'mm',
      collection_method: '自动监测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-15 10:00:00',
      region_id: sampleRegions[0].id,
      resource_type_id: 'water',
      indicator_id: sampleIndicators[10].id, // 地表水储量
      value: 850.5,
      unit: '万m³',
      collection_method: '人工观测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-15 14:00:00',
      region_id: sampleRegions[0].id,
      resource_type_id: 'water',
      indicator_id: sampleIndicators[11].id, // 水质指数
      value: 78.5,
      unit: '无量纲',
      collection_method: '实地调查'
    },
    
    // 东北大兴安岭植被覆盖区观测数据
    {
      id: uuidv4(),
      observation_time: '2024-01-16 09:00:00',
      region_id: sampleRegions[1].id,
      resource_type_id: 'surface_cover',
      indicator_id: sampleIndicators[7].id, // 森林覆盖率
      value: 82.3,
      unit: '%',
      collection_method: '遥感监测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-16 09:00:00',
      region_id: sampleRegions[1].id,
      resource_type_id: 'surface_cover',
      indicator_id: sampleIndicators[8].id, // 草地生产力
      value: 4250,
      unit: 'kg/hm²',
      collection_method: '实地调查'
    },
    
    // 内蒙古高原裸地区观测数据
    {
      id: uuidv4(),
      observation_time: '2024-01-17 11:00:00',
      region_id: sampleRegions[2].id,
      resource_type_id: 'climate',
      indicator_id: sampleIndicators[0].id, // 年降水总量
      value: 320,
      unit: 'mm',
      collection_method: '自动监测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-17 11:00:00',
      region_id: sampleRegions[2].id,
      resource_type_id: 'land',
      indicator_id: sampleIndicators[13].id, // 耕地面积
      value: 1250.8,
      unit: 'hm²',
      collection_method: '遥感监测'
    },
    
    // 青藏高原冰川-冻土区观测数据
    {
      id: uuidv4(),
      observation_time: '2024-01-18 08:00:00',
      region_id: sampleRegions[3].id,
      resource_type_id: 'water',
      indicator_id: sampleIndicators[12].id, // 冰川面积
      value: 156.7,
      unit: 'km²',
      collection_method: '遥感监测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-18 08:00:00',
      region_id: sampleRegions[3].id,
      resource_type_id: 'land',
      indicator_id: sampleIndicators[15].id, // 冻土层厚度
      value: 2.8,
      unit: 'm',
      collection_method: '实地调查'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-18 12:00:00',
      region_id: sampleRegions[3].id,
      resource_type_id: 'climate',
      indicator_id: sampleIndicators[1].id, // 年太阳辐射总量
      value: 6800,
      unit: 'MJ/m²',
      collection_method: '自动监测'
    },
    
    // 黄河三角洲过渡区观测数据
    {
      id: uuidv4(),
      observation_time: '2024-01-19 15:00:00',
      region_id: sampleRegions[4].id,
      resource_type_id: 'surface_cover',
      indicator_id: sampleIndicators[7].id, // 森林覆盖率
      value: 35.8,
      unit: '%',
      collection_method: '遥感监测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-19 15:00:00',
      region_id: sampleRegions[4].id,
      resource_type_id: 'water',
      indicator_id: sampleIndicators[11].id, // 水质指数
      value: 65.2,
      unit: '无量纲',
      collection_method: '实地调查'
    },
    
    // 渤海湾海岸区观测数据
    {
      id: uuidv4(),
      observation_time: '2024-01-20 13:00:00',
      region_id: sampleRegions[5].id,
      resource_type_id: 'climate',
      indicator_id: sampleIndicators[0].id, // 年降水总量
      value: 580,
      unit: 'mm',
      collection_method: '自动监测'
    },
    {
      id: uuidv4(),
      observation_time: '2024-01-20 13:00:00',
      region_id: sampleRegions[5].id,
      resource_type_id: 'surface_cover',
      indicator_id: sampleIndicators[8].id, // 草地生产力
      value: 2850,
      unit: 'kg/hm²',
      collection_method: '实地调查'
    }
  ];

  sampleObservations.forEach(observation => {
    db.run(`INSERT OR IGNORE INTO observations (id, observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [observation.id, observation.observation_time, observation.region_id, observation.resource_type_id, observation.indicator_id, observation.value, observation.unit, observation.collection_method]);
  });

  console.log('NRCIM方法示例数据初始化完成！');
  console.log('已插入数据：');
  console.log('- 16个详细指标（覆盖4大类资源的三级指标体系）');
  console.log('- 6个区域模块集（陆地水面区、植被覆盖区、裸地区、冰川-冻土区、过渡区、海岸区）');
  console.log('- 8个功能模块（4个归类模块 + 1个相互作用模块 + 3个赋能模块）');
  console.log('- 14条观测数据（涵盖各区域的典型观测记录）');
};

// 运行初始化
initData();

// 关闭数据库连接
setTimeout(() => {
  db.close();
  console.log('数据库连接已关闭');
}, 1000); 