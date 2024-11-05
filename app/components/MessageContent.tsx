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
        return <div>{content}</div>;
    }

    // 简单的代码块检测和格式化
    const formattedContent = content.split('```').map((block, index) => {
        if (index % 2 === 1) { // 代码块
            const [language, ...code] = block.split('\n');
            return (
                <pre key={index} className="my-2">
                    <code className={`language-${language.trim()}`}>
                        {code.join('\n')}
                    </code>
                </pre>
            );
        }
        // 普通文本
        return <p key={index} className="whitespace-pre-wrap">{block}</p>;
    });

    return (
        <div className="message-content">
            {formattedContent}
        </div>
    );
} 