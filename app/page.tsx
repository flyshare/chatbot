'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginButton from './components/LoginButton';
import MessageContent from './components/MessageContent';
import { chatService, type ChatMessage } from './utils/chatService';
import AuthForm from './components/AuthForm';
import { chatWithDeepseek } from './utils/api';

export default function Home() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载聊天历史
  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      setMessages([]);
    }
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;
    setIsHistoryLoading(true);
    setError(null);
    try {
      const history = await chatService.getChatHistory(user.uid);
      setMessages(history.reverse());
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('加载聊天记录失败，请刷新页面重试');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // 添加处理提交的函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage: ChatMessage = {
      userId: user.uid,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 保存用户消息
      await chatService.saveMessage(userMessage);

      // 准备发送给 API 的消息历史
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 获取 AI 回复
      const response = await chatWithDeepseek(apiMessages);

      // 创建并保存 AI 回复
      const assistantMessage: ChatMessage = {
        userId: user.uid,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      await chatService.saveMessage(assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // 显示错误消息
      const errorMessage: ChatMessage = {
        userId: user.uid,
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">AI 学习助手</h1>
          {user && <LoginButton />}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {!user ? (
          <div className="py-12">
            <AuthForm />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isHistoryLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-red-500 text-center">
                    <p>{error}</p>
                    <button
                      onClick={loadChatHistory}
                      className="mt-2 text-blue-500 hover:text-blue-600"
                    >
                      重试
                    </button>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  开始你的第一次对话吧！
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      <MessageContent
                        content={message.content}
                        isUser={message.role === 'user'}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="请输入您的问题..."
                  disabled={isLoading}
                  className="flex-1 rounded-full px-4 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? '发送中...' : '发送'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
