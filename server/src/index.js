import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './db/init.js';
import { initScheduledTasks } from './utils/pushService.js';
import authRoutes from './routes/auth.js';
import policyRoutes from './routes/policies.js';
import userRoutes from './routes/user.js';
import notificationRoutes from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 政策指南针后端服务已启动`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📁 数据库已连接`);
  
  // 启动定时任务
  initScheduledTasks();
  
  console.log(``);
});

export default app;
