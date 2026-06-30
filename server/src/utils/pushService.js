import db from './init.js';
import { sendNotification, broadcastToSubscribers } from '../routes/notifications.js';

export const initScheduledTasks = () => {
  console.log('⏰ 定时任务已启动');
  
  // 每小时检查一次（演示用，实际可以按需求调整）
  setInterval(() => {
    checkPolicyUpdates();
  }, 60 * 60 * 1000);

  // 启动时检查一次（模拟有新政策）
  setTimeout(() => {
    console.log('📡 推送服务就绪，等待新政策...');
  }, 2000);
};

const checkPolicyUpdates = () => {
  try {
    // 这里可以检查是否有新政策发布
    // 如果有新政策，就给订阅的用户发通知
    console.log('🔍 检查政策更新中...');
  } catch (error) {
    console.error('检查政策更新失败:', error);
  }
};

// 模拟新政策发布推送（测试用）
export const simulateNewPolicyNotification = (policyTitle: string, city: string, category: string) => {
  const title = `📢 新政策上线：${policyTitle}`;
  const content = `${city}新增一项政策，快来看看你是否符合条件！`;
  
  // 给城市订阅用户发通知
  const cityCount = broadcastToSubscribers('city', city, title, content);
  
  // 给分类订阅用户发通知
  const categoryCount = broadcastToSubscribers('category', category, title, content);
  
  console.log(`📨 新政策通知已发送：城市 ${cityCount} 人，分类 ${categoryCount} 人`);
  return { cityCount, categoryCount };
};

export const sendWelcomeNotification = (userId: number) => {
  sendNotification(
    userId,
    '🎉 欢迎加入政策指南针',
    '你已成功注册！现在可以开始探索各地大学生政策福利，还可以订阅感兴趣的城市和分类，第一时间获取政策更新通知。',
    'success'
  );
};

export default { initScheduledTasks, simulateNewPolicyNotification, sendWelcomeNotification };
