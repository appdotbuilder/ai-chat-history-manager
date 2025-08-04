import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icon';
import { Bot, Plus, MessageCircle, Send, Loader2 } from 'lucide-react';
// Simple date formatting utility
const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface ChatMessage {
    id: number;
    message: string;
    type: 'user' | 'bot';
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
}

interface Props {
    chatHistory: ChatMessage[];
    sessionId?: string;
    [key: string]: unknown;
}

export default function Chat({ chatHistory = [], sessionId }: Props) {
    const [message, setMessage] = useState('');
    const [currentSessionId, setCurrentSessionId] = useState(sessionId || '');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Generate new session ID if none provided
    useEffect(() => {
        if (!currentSessionId) {
            const newSessionId = crypto.randomUUID();
            setCurrentSessionId(newSessionId);
        }
    }, [currentSessionId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!message.trim() || isLoading) return;

        setIsLoading(true);
        
        router.post(route('chat.store'), {
            message: message.trim(),
            session_id: currentSessionId,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setMessage('');
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const startNewChat = () => {
        const newSessionId = crypto.randomUUID();
        setCurrentSessionId(newSessionId);
        router.get(route('chat.index'), { session_id: newSessionId });
    };

    return (
        <AppShell>
            <div className="flex flex-col h-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                            <Icon iconNode={Bot} className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
                            <p className="text-sm text-muted-foreground">
                                Ask me anything! I'm here to help 🤖
                            </p>
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={startNewChat}
                        className="gap-2"
                    >
                        <Icon iconNode={Plus} className="h-4 w-4" />
                        New Chat
                    </Button>
                </div>

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {chatHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <Icon iconNode={MessageCircle} className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    Welcome to your AI chat assistant! Ask me questions, request help, 
                                    or just have a friendly conversation.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {[
                                        "Tell me a joke 😄",
                                        "What can you help me with?",
                                        "Explain quantum physics",
                                        "Help me cook pasta 🍝"
                                    ].map((suggestion) => (
                                        <Button
                                            key={suggestion}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setMessage(suggestion)}
                                            className="text-xs"
                                        >
                                            {suggestion}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            chatHistory.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${
                                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {msg.type === 'bot' && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                AI
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    
                                    <Card className={`max-w-[80%] p-3 ${
                                        msg.type === 'user' 
                                            ? 'bg-primary text-primary-foreground ml-auto' 
                                            : 'bg-muted'
                                    }`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                        <p className={`text-xs mt-2 ${
                                            msg.type === 'user' 
                                                ? 'text-primary-foreground/70' 
                                                : 'text-muted-foreground'
                                        }`}>
                                            {formatTime(msg.created_at)}
                                        </p>
                                    </Card>
                                    
                                    {msg.type === 'user' && (
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                                {msg.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="p-4 border-t">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={isLoading}
                            className="flex-1"
                            maxLength={2000}
                        />
                        <Button 
                            type="submit" 
                            disabled={!message.trim() || isLoading}
                            className="gap-2"
                        >
                            {isLoading ? (
                                <Icon iconNode={Loader2} className="h-4 w-4 animate-spin" />
                            ) : (
                                <Icon iconNode={Send} className="h-4 w-4" />
                            )}
                            Send
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        AI responses are generated automatically and may not always be accurate.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}