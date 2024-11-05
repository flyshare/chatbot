'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface MessageContentProps {
    content: string;
    isUser: boolean;
}

export default function MessageContent({ content, isUser }: MessageContentProps) {
    useEffect(() => {
        hljs.highlightAll();
    }, [content]);

    if (isUser) {
        return <div className="text-white">{content}</div>;
    }

    // 处理文本中的特殊标记和格式
    const formatText = (text: string) => {
        // 分割文本，保留分隔符
        const parts = text.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            // 处理代码块
            if (part.startsWith('```') && part.endsWith('```')) {
                const [, language, ...code] = part.slice(3, -3).split('\n');
                return (
                    <div key={index} className="my-4">
                        <div className="bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded-t-lg">
                            {language || 'text'}
                        </div>
                        <pre className="mt-0 rounded-t-none">
                            <code className={`language-${language || 'text'}`}>
                                {code.join('\n')}
                            </code>
                        </pre>
                    </div>
                );
            }
            // 处理普通文本
            else {
                // 处理emoji标记的特殊段落
                const lines = part.split('\n').map((line, lineIndex) => {
                    // 处理不同类型的标记
                    if (line.startsWith('💡')) {
                        return (
                            <div key={lineIndex} className="tip-block my-2 p-3 bg-blue-50 rounded-lg">
                                {line}
                            </div>
                        );
                    }
                    if (line.startsWith('🤔')) {
                        return (
                            <div key={lineIndex} className="think-block my-2 p-3 bg-purple-50 rounded-lg">
                                {line}
                            </div>
                        );
                    }
                    if (line.startsWith('📝')) {
                        return (
                            <div key={lineIndex} className="example-block my-2 p-3 bg-green-50 rounded-lg">
                                {line}
                            </div>
                        );
                    }
                    if (line.startsWith('✨')) {
                        return (
                            <div key={lineIndex} className="summary-block my-2 p-3 bg-yellow-50 rounded-lg">
                                {line}
                            </div>
                        );
                    }
                    if (line.startsWith('👉')) {
                        return (
                            <div key={lineIndex} className="step-block my-2 pl-4 border-l-4 border-blue-400">
                                {line}
                            </div>
                        );
                    }
                    if (line.startsWith('❗')) {
                        return (
                            <div key={lineIndex} className="warning-block my-2 p-3 bg-red-50 rounded-lg">
                                {line}
                            </div>
                        );
                    }
                    // 处理列表项
                    if (line.startsWith('•')) {
                        return (
                            <div key={lineIndex} className="list-item my-1 pl-4">
                                {line}
                            </div>
                        );
                    }
                    // 普通段落
                    return line ? (
                        <p key={lineIndex} className="my-2">
                            {line}
                        </p>
                    ) : null;
                });

                return <div key={index}>{lines}</div>;
            }
        });
    };

    return (
        <div className="message-content text-gray-800">
            {formatText(content)}
        </div>
    );
} 