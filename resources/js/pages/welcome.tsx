import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icon';
import { 
    Bot, 
    MessageCircle, 
    History, 
    Zap, 
    ShieldCheck, 
    UserPlus, 
    LogIn, 
    Sparkles, 
    ArrowRight
} from 'lucide-react';

interface Props {
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    [key: string]: unknown;
}

export default function Welcome({ auth }: Props) {
    const features = [
        {
            icon: MessageCircle,
            title: 'Intelligent Conversations',
            description: 'Engage in natural conversations with our AI assistant that understands context and provides helpful responses.',
        },
        {
            icon: History,
            title: 'Complete Chat History',
            description: 'All your conversations are saved and organized, so you can revisit previous discussions anytime.',
        },
        {
            icon: Zap,
            title: 'Instant Responses',
            description: 'Get immediate, thoughtful responses to your questions, jokes, explanations, and more.',
        },
        {
            icon: ShieldCheck,
            title: 'Secure & Private',
            description: 'Your conversations are protected with enterprise-grade security and privacy controls.',
        },
    ];

    const demoConversation = [
        { type: 'user', message: 'Tell me a joke about programming!' },
        { type: 'bot', message: 'Why don\'t programmers like nature? Because it has too many bugs! 🐛😄' },
        { type: 'user', message: 'That\'s hilarious! Can you help me with cooking?' },
        { type: 'bot', message: 'Absolutely! 👨‍🍳 I can help with recipes, techniques, and cooking tips. What would you like to cook?' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Navigation */}
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                <Icon iconNode={Bot} className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI Chat Assistant
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        Welcome back, {auth.user.name}!
                                    </span>
                                    <Link href="/dashboard">
                                        <Button variant="outline" size="sm">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/chat">
                                        <Button size="sm" className="gap-2">
                                            <Icon iconNode={MessageCircle} className="h-4 w-4" />
                                            Start Chatting
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="gap-2">
                                            <Icon iconNode={UserPlus} className="h-4 w-4" />
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Icon iconNode={Sparkles} className="h-4 w-4" />
                        Powered by Advanced AI
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                        🤖 Your Personal{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI Assistant
                        </span>
                    </h1>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        Experience intelligent conversations with our advanced AI chatbot. 
                        Get instant answers, creative ideas, helpful explanations, and engaging discussions 
                        - all in one beautiful, secure platform.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {auth.user ? (
                            <Link href="/chat">
                                <Button size="lg" className="gap-3 text-lg px-8 py-6">
                                    <Icon iconNode={MessageCircle} className="h-5 w-5" />
                                    Start Chatting Now
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/register">
                                    <Button size="lg" className="gap-3 text-lg px-8 py-6">
                                        <Icon iconNode={UserPlus} className="h-5 w-5" />
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="gap-3 text-lg px-8 py-6">
                                        <Icon iconNode={LogIn} className="h-5 w-5" />
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Demo Chat Preview */}
                <div className="max-w-2xl mx-auto mb-16">
                    <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                    <Icon iconNode={Bot} className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Live Chat Preview</CardTitle>
                                    <p className="text-sm text-muted-foreground">See how conversations flow naturally</p>
                                </div>
                                <Badge variant="secondary" className="ml-auto">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    Online
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {demoConversation.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex gap-3 ${
                                        msg.type === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                            msg.type === 'user'
                                                ? 'bg-blue-500 text-white ml-auto'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                        }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div className="text-center pt-2">
                                <p className="text-xs text-muted-foreground">
                                    ✨ This is just a sample - try it yourself!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-fit mx-auto mb-4">
                                    <Icon iconNode={feature.icon} className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to start your AI conversation? 💬
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who are already experiencing the future of AI-powered conversations. 
                        It's free, secure, and incredibly smart.
                    </p>
                    
                    {auth.user ? (
                        <Link href="/chat">
                            <Button size="lg" className="gap-3 text-lg px-8 py-6">
                                <Icon iconNode={ArrowRight} className="h-5 w-5" />
                                Continue to Chat
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="gap-3 text-lg px-8 py-6">
                                    <Icon iconNode={UserPlus} className="h-5 w-5" />
                                    Create Free Account
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="gap-3 text-lg px-8 py-6">
                                    <Icon iconNode={LogIn} className="h-5 w-5" />
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-3 mb-4 md:mb-0">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                                <Icon iconNode={Bot} className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                AI Chat Assistant
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2024 AI Chat Assistant. Powered by advanced artificial intelligence.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}