import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icon';
import { 
    MessageCircle, 
    MessageSquare, 
    Send, 
    TrendingUp, 
    Globe, 
    Clock, 
    Plus,
    User,
    Bot,
    Laugh,
    ChefHat,
    HelpCircle,
    Cloud,
    Cpu,
    Tag
} from 'lucide-react';

// Simple date formatting utility
const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

interface ChatMessage {
    id: number;
    message: string;
    type: 'user' | 'bot';
    created_at: string;
}

interface UserStats {
    total_conversations: number;
    total_messages: number;
    recent_chats: ChatMessage[];
    popular_topics: Record<string, number>;
}

interface GlobalStats {
    total_users_chatting: number;
    total_messages_today: number;
    active_sessions: number;
}

interface Props {
    userStats: UserStats;
    globalStats: GlobalStats;
    [key: string]: unknown;
}

export default function Dashboard({ userStats, globalStats }: Props) {
    const topicIcons: Record<string, React.ComponentType> = {
        humor: Laugh,
        cooking: ChefHat,
        assistance: HelpCircle,
        weather: Cloud,
        technology: Cpu,
    };

    return (
        <AppShell>
            <Head title="Dashboard" />
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome back! Here's your AI chat activity overview.
                        </p>
                    </div>
                    <Link href="/chat">
                        <Button className="gap-2">
                            <Icon iconNode={MessageCircle} className="h-4 w-4" />
                            Start New Chat
                        </Button>
                    </Link>
                </div>

                {/* Personal Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Conversations
                            </CardTitle>
                            <Icon iconNode={MessageSquare} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userStats.total_conversations}</div>
                            <p className="text-xs text-muted-foreground">
                                Chat sessions created
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Messages Sent
                            </CardTitle>
                            <Icon iconNode={Send} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userStats.total_messages}</div>
                            <p className="text-xs text-muted-foreground">
                                Your messages to AI
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Favorite Topics
                            </CardTitle>
                            <Icon iconNode={TrendingUp} className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {Object.entries(userStats.popular_topics).slice(0, 3).map(([topic, count]) => (
                                    <Badge key={topic} variant="secondary" className="text-xs gap-1">
                                        <Icon 
                                            iconNode={topicIcons[topic] || Tag} 
                                            className="h-3 w-3" 
                                        />
                                        {topic} ({count})
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Global Platform Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon iconNode={Globe} className="h-5 w-5" />
                            Platform Activity
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            See how the AI chat platform is being used globally
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {globalStats.total_users_chatting}
                                </div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {globalStats.total_messages_today}
                                </div>
                                <p className="text-sm text-muted-foreground">Messages Today</p>
                            </div>
                            <div className="text-center p-4 bg-muted rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {globalStats.active_sessions}
                                </div>
                                <p className="text-sm text-muted-foreground">Active Sessions (24h)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Chat Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon iconNode={Clock} className="h-5 w-5" />
                            Recent Chat Activity
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Your latest messages and conversations
                        </p>
                    </CardHeader>
                    <CardContent>
                        {userStats.recent_chats.length === 0 ? (
                            <div className="text-center py-8">
                                <Icon iconNode={MessageCircle} className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No recent chats</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start your first conversation with our AI assistant!
                                </p>
                                <Link href="/chat">
                                    <Button>
                                        <Icon iconNode={Plus} className="h-4 w-4 mr-2" />
                                        Start Chatting
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userStats.recent_chats.map((chat) => (
                                    <div key={chat.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className={`p-2 rounded-lg ${
                                            chat.type === 'user' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-secondary text-secondary-foreground'
                                        }`}>
                                            <Icon 
                                                iconNode={chat.type === 'user' ? User : Bot} 
                                                className="h-4 w-4" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium capitalize">
                                                {chat.type === 'user' ? 'You' : 'AI Assistant'}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {chat.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatDateTime(chat.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-4">
                                    <Link href="/chat">
                                        <Button variant="outline">
                                            View All Conversations
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}