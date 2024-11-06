'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginButton() {
    const { user, signInWithGoogle, signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await signInWithGoogle();
        } catch (err) {
            setError('登录失败，请稍后重试');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await signOut();
        } catch (err) {
            setError('退出失败，请稍后重试');
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {user ? (
                <div className="flex items-center gap-3">
                    {user.photoURL && (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="w-8 h-8 rounded-full"
                        />
                    )}
                    <span className="text-sm text-gray-700">{user.displayName}</span>
                    <button
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '处理中...' : '退出登录'}
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleSignIn}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-4 h-4"
                    />
                    {isLoading ? '登录中...' : '使用 Google 登录'}
                </button>
            )}
            {error && (
                <div className="text-sm text-red-500 mt-2">
                    {error}
                </div>
            )}
        </div>
    );
} 