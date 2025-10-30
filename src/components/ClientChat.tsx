import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

const CHATS_URL = 'https://functions.poehali.dev/9c978ffb-9172-4d21-bdb2-bcba03d32526';

export function ClientChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatId, setChatId] = useState<number | null>(null);
  const [clientId, setClientId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`client-${Date.now()}-${Math.random()}`);

  useEffect(() => {
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const initChat = async () => {
    try {
      const response = await fetch(CHATS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_chat',
          session_id: sessionId.current,
          client_name: 'Клиент'
        })
      });
      const data = await response.json();
      if (data.success) {
        setChatId(data.chat_id);
        setClientId(data.client_id);
        setMessages([
          { sender_type: 'operator', message: 'Здравствуйте! Чем могу помочь?' }
        ]);
      }
    } catch (error) {
      console.error('Failed to init chat', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !chatId) return;

    const newMessage = {
      sender_type: 'client',
      message: inputText,
      sender_id: clientId
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    try {
      await fetch(CHATS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          chat_id: chatId,
          sender_type: 'client',
          sender_id: clientId,
          message: inputText
        })
      });
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-slate-700">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Headphones" size={20} />
            </div>
            <div>
              <CardTitle className="text-xl">Поддержка клиентов</CardTitle>
              <p className="text-sm text-blue-100 mt-1">Онлайн - готовы помочь</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea ref={scrollRef} className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.sender_type === 'client'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-900 rounded-bl-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Напишите сообщение..."
                className="flex-1"
              />
              <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
