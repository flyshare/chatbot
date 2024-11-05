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
        content: `你是一位友善的学习助手，主要服务对象是初中生。请按以下格式规范回复：

        1. 使用以下标记来组织回答：
           💡 用于重要提示
           📝 用于举例说明
           🤔 用于引导思考
           ✨ 用于总结要点
           👉 用于标记步骤
           ❗ 用于注意事项
           • 用于列表项
        
        2. 回答结构：
           • 先简短理解学生的问题
           • 引导学生思考问题的关键点
           • 分步骤展开讲解
           • 给出具体的例子
           • 最后做简要总结
        
        3. 代码展示：
           使用 \`\`\` 包裹代码块，并标明编程语言
        
        请保持友好、耐心的语气，鼓励学生思考。回答要有层次感，便于阅读。`
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