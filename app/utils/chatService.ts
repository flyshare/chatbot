import { db } from './firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    deleteDoc
} from 'firebase/firestore';

export interface ChatMessage {
    id?: string;
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const chatService = {
    // 保存消息
    async saveMessage(message: Omit<ChatMessage, 'id'>) {
        try {
            await addDoc(collection(db, 'messages'), {
                ...message,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    },

    // 获取用户的聊天历史
    async getChatHistory(userId: string) {
        try {
            const q = query(
                collection(db, 'messages'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate()
            })) as ChatMessage[];
        } catch (error) {
            console.error('Error getting chat history:', error);
            throw error;
        }
    },

    // 删除消息
    async deleteMessage(messageId: string) {
        try {
            await deleteDoc(doc(db, 'messages', messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }
}; 