'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../utils/firebase';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            setError(err.message || '发生错误，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                {isLogin ? '登录' : '注册'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        邮箱地址
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入邮箱"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        密码
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="请输入密码"
                        required
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-500 text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">或</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    使用 Google 账号登录
                </button>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
                    </button>
                </div>
            </form>
        </div>
    );
} 