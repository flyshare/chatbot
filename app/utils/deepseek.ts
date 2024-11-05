const DEEPSEEK_API_KEY = 'sk-a1b78c1e96374cbd800485c2368379f0';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function chatWithDeepseek(messages: { role: string; content: string }[]) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
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