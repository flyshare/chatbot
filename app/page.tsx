'use client';

import { useState } from 'react';
import MessageContent from './components/MessageContent';
import { chatWithDeepseek, type ApiMessage } from './utils/api';
import 'highlight.js/styles/github-dark.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 准备发送给 API 的消息历史
      const apiMessages: ApiMessage[] = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // 调用 API
      const response = await chatWithDeepseek(apiMessages);

      // 添加 AI 的回复
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // 显示错误消息
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 更新标题区域，使其更友好 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            学习小助手
          </h1>
          <p className="text-gray-600 mt-2">
            和我一起探索知识的奥秘吧！
          </p>
          {/* 添加温馨提示 */}
          <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg inline-block">
            <p>💡 小贴士：</p>
            <p>1. 遇到问题时，先试着自己思考</p>
            <p>2. 可以告诉我你的想法，我们一起讨论</p>
            <p>3. 记住：学习的过程比答案更重要哦！</p>
          </div>
        </div>

        {/* 聊天窗口 */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 h-[500px] flex flex-col">
          {/* 聊天记录区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p>👋 你好啊！有什么想问的问题吗？</p>
                <p className="text-sm mt-2">我会引导你思考，帮助你找到答案！</p>
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-blue-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="写下你的问题或想法..."
                disabled={isLoading}
                className="flex-1 rounded-full px-4 py-2 border border-blue-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? '思考中...' : '发送'}
              </button>
            </div>
          </form>
        </div>

        {/* 添加学习小贴士 */}
        <div className="mt-4 text-center text-sm text-gray-500">
          记住：学习最重要的是理解过程，而不是简单地得到答案哦！
        </div>
      </main>
    </div>
  );
}
