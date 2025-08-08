const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/build')));

// 数据库初始化
const db = new sqlite3.Database('./natural_resources.db');

// 创建数据表
db.serialize(() => {
  // 资源类型表
  db.run(`CREATE TABLE IF NOT EXISTS resource_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    description TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 指标体系表
  db.run(`CREATE TABLE IF NOT EXISTS indicators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER,
    resource_type_id TEXT,
    description TEXT,
    source_type TEXT,
    unit TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_type_id) REFERENCES resource_types (id)
  )`);

  // 模块归类表
  db.run(`CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    indicators TEXT,
    applicable_regions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 区域配置表
  db.run(`CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    characteristics TEXT,
    indicators TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 数据记录表
  db.run(`CREATE TABLE IF NOT EXISTS observations (
    id TEXT PRIMARY KEY,
    observation_time DATETIME,
    region_id TEXT,
    resource_type_id TEXT,
    indicator_id TEXT,
    value REAL,
    unit TEXT,
    collection_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions (id),
    FOREIGN KEY (resource_type_id) REFERENCES resource_types (id),
    FOREIGN KEY (indicator_id) REFERENCES indicators (id)
  )`);

  // 插入初始数据
  const initialResourceTypes = [
    { id: 'climate', name: '气候资源', parent_id: null, category: 'climate' },
    { id: 'surface_cover', name: '地表覆盖', parent_id: null, category: 'surface' },
    { id: 'water', name: '水资源', parent_id: null, category: 'water' },
    { id: 'land', name: '土地资源', parent_id: null, category: 'land' }
  ];

  initialResourceTypes.forEach(type => {
    db.run(`INSERT OR IGNORE INTO resource_types (id, name, parent_id, category) VALUES (?, ?, ?, ?)`,
      [type.id, type.name, type.parent_id, type.category]);
  });
});

// API路由

// 获取资源类型
app.get('/api/resource-types', (req, res) => {
  db.all('SELECT * FROM resource_types ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加资源类型
app.post('/api/resource-types', (req, res) => {
  const { name, parent_id, description, category } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO resource_types (id, name, parent_id, description, category) VALUES (?, ?, ?, ?, ?)`,
    [id, name, parent_id, description, category], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, parent_id, description, category });
  });
});

// 更新资源类型
app.put('/api/resource-types/:id', (req, res) => {
  const { id } = req.params;
  const { name, parent_id, description, category } = req.body;
  
  db.run(`UPDATE resource_types SET name = ?, parent_id = ?, description = ?, category = ? WHERE id = ?`,
    [name, parent_id, description, category, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, parent_id, description, category });
  });
});

// 删除资源类型
app.delete('/api/resource-types/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM resource_types WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '删除成功' });
  });
});

// 获取指标体系
app.get('/api/indicators', (req, res) => {
  db.all(`
    SELECT i.*, rt.name as resource_type_name 
    FROM indicators i 
    LEFT JOIN resource_types rt ON i.resource_type_id = rt.id 
    ORDER BY i.level, i.name
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加指标
app.post('/api/indicators', (req, res) => {
  const { name, level, resource_type_id, description, source_type, unit } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO indicators (id, name, level, resource_type_id, description, source_type, unit) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, name, level, resource_type_id, description, source_type, unit], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, level, resource_type_id, description, source_type, unit });
  });
});

// 更新指标
app.put('/api/indicators/:id', (req, res) => {
  const { id } = req.params;
  const { name, level, resource_type_id, description, source_type, unit } = req.body;
  
  db.run(`UPDATE indicators SET name = ?, level = ?, resource_type_id = ?, description = ?, source_type = ?, unit = ? WHERE id = ?`,
    [name, level, resource_type_id, description, source_type, unit, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, level, resource_type_id, description, source_type, unit });
  });
});

// 删除指标
app.delete('/api/indicators/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM indicators WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '删除成功' });
  });
});

// 获取模块
app.get('/api/modules', (req, res) => {
  db.all('SELECT * FROM modules ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加模块
app.post('/api/modules', (req, res) => {
  const { name, description, indicators, applicable_regions } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO modules (id, name, description, indicators, applicable_regions) VALUES (?, ?, ?, ?, ?)`,
    [id, name, description, JSON.stringify(indicators), JSON.stringify(applicable_regions)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, description, indicators, applicable_regions });
  });
});

// 更新模块
app.put('/api/modules/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, indicators, applicable_regions } = req.body;
  
  db.run(`UPDATE modules SET name = ?, description = ?, indicators = ?, applicable_regions = ? WHERE id = ?`,
    [name, description, JSON.stringify(indicators), JSON.stringify(applicable_regions), id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, description, indicators, applicable_regions });
  });
});

// 删除模块
app.delete('/api/modules/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM modules WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '删除成功' });
  });
});

// 获取区域
app.get('/api/regions', (req, res) => {
  db.all('SELECT * FROM regions ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加区域
app.post('/api/regions', (req, res) => {
  const { name, type, characteristics, indicators } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO regions (id, name, type, characteristics, indicators) VALUES (?, ?, ?, ?, ?)`,
    [id, name, type, JSON.stringify(characteristics), JSON.stringify(indicators)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, type, characteristics, indicators });
  });
});

// 更新区域
app.put('/api/regions/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, characteristics, indicators } = req.body;
  
  db.run(`UPDATE regions SET name = ?, type = ?, characteristics = ?, indicators = ? WHERE id = ?`,
    [name, type, JSON.stringify(characteristics), JSON.stringify(indicators), id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, name, type, characteristics, indicators });
  });
});

// 删除区域
app.delete('/api/regions/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM regions WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '删除成功' });
  });
});

// 获取观测数据
app.get('/api/observations', (req, res) => {
  db.all(`
    SELECT o.*, r.name as region_name, rt.name as resource_type_name, i.name as indicator_name
    FROM observations o
    LEFT JOIN regions r ON o.region_id = r.id
    LEFT JOIN resource_types rt ON o.resource_type_id = rt.id
    LEFT JOIN indicators i ON o.indicator_id = i.id
    ORDER BY o.observation_time DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加观测数据
app.post('/api/observations', (req, res) => {
  const { observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO observations (id, observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method });
  });
});

// 更新观测数据
app.put('/api/observations/:id', (req, res) => {
  const { id } = req.params;
  const { observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method } = req.body;
  
  db.run(`UPDATE observations SET observation_time = ?, region_id = ?, resource_type_id = ?, indicator_id = ?, value = ?, unit = ?, collection_method = ? WHERE id = ?`,
    [observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id, observation_time, region_id, resource_type_id, indicator_id, value, unit, collection_method });
  });
});

// 删除观测数据
app.delete('/api/observations/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM observations WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '删除成功' });
  });
});

// 获取统计数据
app.get('/api/statistics', (req, res) => {
  db.get('SELECT COUNT(*) as total_observations FROM observations', (err, obsCount) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.get('SELECT COUNT(*) as total_indicators FROM indicators', (err, indCount) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.get('SELECT COUNT(*) as total_regions FROM regions', (err, regCount) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        
        res.json({
          total_observations: obsCount.total_observations,
          total_indicators: indCount.total_indicators,
          total_regions: regCount.total_regions
        });
      });
    });
  });
});

// 前端路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 