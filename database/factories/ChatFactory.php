<?php

namespace Database\Factories;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chat>
 */
class ChatFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Chat>
     */
    protected $model = Chat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $messages = [
            'user' => [
                'Hello, how are you today?',
                'What can you help me with?',
                'Tell me a joke',
                'What\'s the weather like?',
                'How do I cook pasta?',
                'Explain quantum physics',
                'What are your capabilities?',
                'Help me with my homework',
            ],
            'bot' => [
                'Hello! I\'m doing well, thank you for asking. How can I assist you today?',
                'I can help you with a variety of tasks including answering questions, providing explanations, creative writing, and more!',
                'Why don\'t scientists trust atoms? Because they make up everything!',
                'I don\'t have access to real-time weather data, but you can check your local weather service for current conditions.',
                'To cook pasta: Boil salted water, add pasta, cook according to package directions (usually 8-12 minutes), then drain.',
                'Quantum physics is the study of matter and energy at the smallest scales, where particles behave in ways that seem counterintuitive.',
                'I can answer questions, help with writing, explain concepts, provide summaries, and assist with various tasks.',
                'I\'d be happy to help with your homework! What subject are you working on?',
            ]
        ];

        $isBot = $this->faker->boolean(50);
        $type = $isBot ? 'bot' : 'user';
        
        return [
            'user_id' => $isBot ? null : User::factory(),
            'session_id' => $this->faker->uuid(),
            'message' => $this->faker->randomElement($messages[$type]),
            'type' => $type,
            'metadata' => [
                'ip_address' => $this->faker->ipv4(),
                'user_agent' => $this->faker->userAgent(),
                'location' => $this->faker->optional()->city(),
            ],
        ];
    }

    /**
     * Indicate that the chat message is from a user.
     */
    public function user(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'user',
            'user_id' => User::factory(),
        ]);
    }

    /**
     * Indicate that the chat message is from the bot.
     */
    public function bot(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'bot',
            'user_id' => null,
        ]);
    }
}