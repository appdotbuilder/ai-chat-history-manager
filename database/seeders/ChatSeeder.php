<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a few users if they don't exist
        if (User::count() === 0) {
            User::factory(3)->create();
        }

        $users = User::take(3)->get();

        // Create sample chat sessions
        foreach ($users as $user) {
            $sessionId = Str::uuid();
            
            // First conversation - greeting and jokes
            $conversations = [
                [
                    'user_message' => 'Hello! How are you today?',
                    'bot_message' => "Hello! 👋 I'm doing great, thanks for asking! I'm here and ready to help with whatever you need. How are you doing today?",
                ],
                [
                    'user_message' => 'Tell me a funny programming joke!',
                    'bot_message' => "Why don't programmers like nature? Because it has too many bugs! 🐛😄 Here's another one: Why do Java developers wear glasses? Because they can't C#! 👓",
                ],
                [
                    'user_message' => 'That\'s hilarious! Can you help me with cooking pasta?',
                    'bot_message' => "Absolutely! 👨‍🍳 Here's how to cook perfect pasta:\n\n1. Bring a large pot of salted water to boil\n2. Add pasta and stir occasionally\n3. Cook for 8-12 minutes (check package directions)\n4. Taste test - should be al dente (firm but not hard)\n5. Drain and serve immediately!\n\nPro tip: Save some pasta water - it's great for thinning sauces! What type of pasta are you making?",
                ],
            ];

            foreach ($conversations as $index => $conversation) {
                // User message
                Chat::create([
                    'user_id' => $user->id,
                    'session_id' => $sessionId,
                    'message' => $conversation['user_message'],
                    'type' => 'user',
                    'metadata' => [
                        'ip_address' => '127.0.0.1',
                        'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                        'session_start' => now()->subMinutes(30 - $index * 5)->toISOString(),
                    ],
                    'created_at' => now()->subMinutes(30 - $index * 5),
                ]);

                // Bot response
                Chat::create([
                    'user_id' => null,
                    'session_id' => $sessionId,
                    'message' => $conversation['bot_message'],
                    'type' => 'bot',
                    'metadata' => [
                        'ip_address' => '127.0.0.1',
                        'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                        'session_start' => now()->subMinutes(30 - $index * 5)->toISOString(),
                    ],
                    'created_at' => now()->subMinutes(30 - $index * 5)->addSeconds(30),
                ]);
            }

            // Second session - different topic
            $sessionId2 = Str::uuid();
            $conversations2 = [
                [
                    'user_message' => 'What can you help me with?',
                    'bot_message' => "I'm here to help! 🤖 I can assist you with:\n\n• Answering questions on various topics\n• Explaining complex concepts\n• Creative writing and brainstorming\n• Problem-solving and analysis\n• Cooking tips and recipes\n• Technology guidance\n• General conversation and more!\n\nWhat specific topic interests you?",
                ],
                [
                    'user_message' => 'Explain quantum physics in simple terms',
                    'bot_message' => "Great question! 🔬 Quantum physics is like the rulebook for the tiniest particles in the universe. Here's the simple version:\n\n🌟 **Key Ideas:**\n• Particles can be in multiple places at once (superposition)\n• Observing them changes their behavior\n• Particles can be \"entangled\" - affecting each other instantly across vast distances\n• Everything is made of waves and particles at the same time\n\nThink of it like a coin spinning in the air - it's both heads and tails until it lands! Would you like me to explain any specific part in more detail?",
                ],
            ];

            foreach ($conversations2 as $index => $conversation) {
                // User message
                Chat::create([
                    'user_id' => $user->id,
                    'session_id' => $sessionId2,
                    'message' => $conversation['user_message'],
                    'type' => 'user',
                    'metadata' => [
                        'ip_address' => '192.168.1.100',
                        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'session_start' => now()->subHours(2)->addMinutes($index * 3)->toISOString(),
                    ],
                    'created_at' => now()->subHours(2)->addMinutes($index * 3),
                ]);

                // Bot response
                Chat::create([
                    'user_id' => null,
                    'session_id' => $sessionId2,
                    'message' => $conversation['bot_message'],
                    'type' => 'bot',
                    'metadata' => [
                        'ip_address' => '192.168.1.100',
                        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'session_start' => now()->subHours(2)->addMinutes($index * 3)->toISOString(),
                    ],
                    'created_at' => now()->subHours(2)->addMinutes($index * 3)->addSeconds(45),
                ]);
            }
        }

        // Create some anonymous chat sessions
        for ($i = 0; $i < 5; $i++) {
            $sessionId = Str::uuid();
            $anonymousConversations = [
                [
                    'user_message' => 'Hi there!',
                    'bot_message' => 'Hello! 😊 Welcome to our AI chat assistant! How can I help you today?',
                ],
                [
                    'user_message' => 'What\'s the weather like?',
                    'bot_message' => 'I don\'t have access to real-time weather data, but I\'d recommend checking your local weather service or a weather app for current conditions! ☀️🌧️ Is there anything else I can help you with?',
                ],
            ];

            foreach ($anonymousConversations as $index => $conversation) {
                // User message (anonymous)
                Chat::create([
                    'user_id' => null,
                    'session_id' => $sessionId,
                    'message' => $conversation['user_message'],
                    'type' => 'user',
                    'metadata' => [
                        'ip_address' => '203.0.113.' . random_int(1, 254),
                        'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
                        'session_start' => now()->subDays(random_int(1, 7))->toISOString(),
                    ],
                    'created_at' => now()->subDays(random_int(1, 7))->addMinutes($index * 2),
                ]);

                // Bot response
                Chat::create([
                    'user_id' => null,
                    'session_id' => $sessionId,
                    'message' => $conversation['bot_message'],
                    'type' => 'bot',
                    'metadata' => [
                        'ip_address' => '203.0.113.' . random_int(1, 254),
                        'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
                        'session_start' => now()->subDays(random_int(1, 7))->toISOString(),
                    ],
                    'created_at' => now()->subDays(random_int(1, 7))->addMinutes($index * 2)->addSeconds(30),
                ]);
            }
        }
    }
}