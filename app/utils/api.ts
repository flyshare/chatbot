const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

if (!DEEPSEEK_API_KEY) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
}

export interface ApiMessage {
    role: string;
    content: string;
}

export async function chatWithDeepseek(messages: ApiMessage[]): Promise<string> {
    const systemMessage: ApiMessage = {
        role: "system",
        content: `你是一位友善的学习助手，主要服务对象是初中生。请遵循以下原则：
        1. 用简单易懂的语言交流
        2. 不直接给出答案，而是通过提问引导学生思考
        3. 鼓励学生独立思考和探索
        4. 适时给予正面鼓励
        5. 使用具体的例子来解释抽象概念
        6. 如果学生思路正确，给予肯定；如果有误，温和地引导纠正
        7. 保持耐心和友好的态度`
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [systemMessage, ...messages],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling Deepseek API:', error);
        throw error;
    }
} 