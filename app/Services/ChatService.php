<?php

namespace App\Services;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatService
{
    /**
     * Generate a bot response to a user message.
     *
     * @param string $userMessage
     * @return string
     */
    public function generateBotResponse(string $userMessage): string
    {
        // Simple AI-like responses based on keywords
        $message = strtolower($userMessage);
        
        // Greeting responses
        if (Str::contains($message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            $responses = [
                "Hello! 👋 How can I help you today?",
                "Hi there! 😊 What can I assist you with?",
                "Hey! Great to see you here. What's on your mind?",
                "Hello! I'm here and ready to help with whatever you need!",
            ];
            return $responses[array_rand($responses)];
        }
        
        // Help requests
        if (Str::contains($message, ['help', 'assist', 'support', 'what can you do'])) {
            return "I'm here to help! 🤖 I can answer questions, provide explanations, help with problem-solving, engage in conversations, and much more. What specific topic would you like assistance with?";
        }
        
        // Jokes
        if (Str::contains($message, ['joke', 'funny', 'laugh', 'humor'])) {
            $jokes = [
                "Why don't scientists trust atoms? Because they make up everything! 😄",
                "I told my wife she was drawing her eyebrows too high. She looked surprised! 😂",
                "Why don't programmers like nature? It has too many bugs! 🐛",
                "What do you call a bear with no teeth? A gummy bear! 🐻",
            ];
            return $jokes[array_rand($jokes)];
        }
        
        // Weather
        if (Str::contains($message, ['weather', 'temperature', 'rain', 'sunny', 'cloudy'])) {
            return "I don't have access to real-time weather data, but I'd recommend checking your local weather service or a weather app for current conditions! ☀️🌧️ Is there anything else I can help you with?";
        }
        
        // Cooking/food
        if (Str::contains($message, ['cook', 'recipe', 'food', 'eat', 'hungry', 'meal'])) {
            return "I'd love to help with cooking! 👨‍🍳 While I can't see your specific question in detail, I can help with recipes, cooking techniques, ingredient substitutions, and meal planning. What specific dish or cooking question do you have?";
        }
        
        // Time/date
        if (Str::contains($message, ['time', 'date', 'today', 'now', 'current'])) {
            return "I don't have access to real-time information, but you can check the current time and date on your device! ⏰ Is there anything else I can help you with?";
        }
        
        // Technology
        if (Str::contains($message, ['computer', 'technology', 'software', 'programming', 'code'])) {
            return "I love talking about technology! 💻 I can help with programming concepts, software recommendations, troubleshooting, and general tech questions. What specific tech topic interests you?";
        }
        
        // Gratitude
        if (Str::contains($message, ['thank', 'thanks', 'appreciate', 'grateful'])) {
            $responses = [
                "You're very welcome! 😊 Happy to help anytime!",
                "My pleasure! That's what I'm here for! 🤗",
                "You're welcome! Feel free to ask if you need anything else!",
                "Glad I could help! Don't hesitate to reach out again! 👍",
            ];
            return $responses[array_rand($responses)];
        }
        
        // Goodbye
        if (Str::contains($message, ['bye', 'goodbye', 'see you', 'farewell', 'later'])) {
            $responses = [
                "Goodbye! 👋 Take care and come back anytime!",
                "See you later! 😊 It was great chatting with you!",
                "Farewell! Hope to talk with you again soon! 🌟",
                "Bye! Have a wonderful day ahead! ☀️",
            ];
            return $responses[array_rand($responses)];
        }
        
        // Default responses
        $defaultResponses = [
            "That's interesting! 🤔 Could you tell me more about what you're looking for?",
            "I'd be happy to help! Can you provide a bit more context about your question?",
            "Great question! 💭 Let me think about that... Could you elaborate on what specifically you'd like to know?",
            "I'm here to assist! 🤖 What particular aspect of this topic would you like to explore?",
            "Thanks for sharing that with me! What would you like to know or discuss about it?",
            "Interesting topic! 🌟 Is there a specific question you have or something particular you'd like help with?",
        ];
        
        return $defaultResponses[array_rand($defaultResponses)];
    }

    /**
     * Store a chat message and generate bot response.
     *
     * @param array $data
     * @param Request $request
     * @return array
     */
    public function processMessage(array $data, Request $request): array
    {
        // Get metadata from request
        $metadata = [
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'session_start' => now()->toISOString(),
        ];

        // Store user message
        $userMessage = Chat::create([
            'user_id' => auth()->id(),
            'session_id' => $data['session_id'],
            'message' => $data['message'],
            'type' => 'user',
            'metadata' => $metadata,
        ]);

        // Generate bot response
        $botResponse = $this->generateBotResponse($data['message']);

        // Store bot message
        $botMessage = Chat::create([
            'user_id' => null,
            'session_id' => $data['session_id'],
            'message' => $botResponse,
            'type' => 'bot',
            'metadata' => $metadata,
        ]);

        return [
            'user_message' => $userMessage,
            'bot_message' => $botMessage,
        ];
    }

    /**
     * Get chat history for a session.
     *
     * @param string $sessionId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getChatHistory(string $sessionId)
    {
        return Chat::bySession($sessionId)
            ->with('user')
            ->orderBy('created_at')
            ->get();
    }
}