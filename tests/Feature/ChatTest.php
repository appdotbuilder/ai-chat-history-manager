<?php

namespace Tests\Feature;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a test user
        $this->user = User::factory()->create();
    }

    public function test_chat_index_page_loads(): void
    {
        $response = $this->get('/chat');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('chat')
                ->has('chatHistory')
                ->has('sessionId')
        );
    }

    public function test_authenticated_user_can_send_chat_message(): void
    {
        $this->actingAs($this->user);
        
        $sessionId = '550e8400-e29b-41d4-a716-446655440001';
        $message = 'Hello, how are you today?';

        $response = $this->post('/chat', [
            'message' => $message,
            'session_id' => $sessionId,
        ]);

        $response->assertStatus(200);
        
        // Check that both user and bot messages were created
        $this->assertDatabaseHas('chats', [
            'user_id' => $this->user->id,
            'session_id' => $sessionId,
            'message' => $message,
            'type' => 'user',
        ]);

        $this->assertDatabaseHas('chats', [
            'user_id' => null,
            'session_id' => $sessionId,
            'type' => 'bot',
        ]);
    }

    public function test_anonymous_user_can_send_chat_message(): void
    {
        $sessionId = '550e8400-e29b-41d4-a716-446655440002';
        $message = 'Tell me a joke';

        $response = $this->post('/chat', [
            'message' => $message,
            'session_id' => $sessionId,
        ]);

        $response->assertStatus(200);
        
        // Check that both user (anonymous) and bot messages were created
        $this->assertDatabaseHas('chats', [
            'user_id' => null,
            'session_id' => $sessionId,
            'message' => $message,
            'type' => 'user',
        ]);

        $this->assertDatabaseHas('chats', [
            'user_id' => null,
            'session_id' => $sessionId,
            'type' => 'bot',
        ]);
    }

    public function test_chat_message_validation(): void
    {
        $sessionId = '550e8400-e29b-41d4-a716-446655440003';

        // Test empty message
        $response = $this->post('/chat', [
            'message' => '',
            'session_id' => $sessionId,
        ]);

        $response->assertSessionHasErrors(['message']);

        // Test message too long
        $response = $this->post('/chat', [
            'message' => str_repeat('a', 2001),
            'session_id' => $sessionId,
        ]);

        $response->assertSessionHasErrors(['message']);

        // Test missing session ID
        $response = $this->post('/chat', [
            'message' => 'Hello',
        ]);

        $response->assertSessionHasErrors(['session_id']);
    }

    public function test_bot_generates_appropriate_responses(): void
    {
        $this->actingAs($this->user);
        
        $testCases = [
            'hello' => ['Hello!', '👋', 'Hi', 'Hey', 'Great to see you'],
            'joke' => ['joke', '😄', '😂', '🐻', 'bear', 'bugs', '🐛'],
            'help' => ['help', 'assist', '🤖'],
            'weather' => ['weather', "don't have access", '☀️'],
            'thank you' => ['welcome', '😊', 'pleasure'],
        ];

        $sessionCounter = 4;
        foreach ($testCases as $userMessage => $expectedPhrases) {
            $sessionId = "550e8400-e29b-41d4-a716-44665544000{$sessionCounter}";
            
            $response = $this->post('/chat', [
                'message' => $userMessage,
                'session_id' => $sessionId,
            ]);

            $response->assertStatus(200);
            
            // Get the bot response
            $botMessage = Chat::where('session_id', $sessionId)
                ->where('type', 'bot')
                ->first();

            $this->assertNotNull($botMessage);
            
            // Check that the response contains at least one expected phrase
            $containsExpectedPhrase = false;
            foreach ($expectedPhrases as $phrase) {
                if (str_contains(strtolower($botMessage->message), strtolower($phrase))) {
                    $containsExpectedPhrase = true;
                    break;
                }
            }
            
            $this->assertTrue(
                $containsExpectedPhrase, 
                "Bot response '{$botMessage->message}' should contain one of: " . implode(', ', $expectedPhrases)
            );
            
            $sessionCounter++;
        }
    }

    public function test_chat_history_is_retrieved_correctly(): void
    {
        $sessionId = '550e8400-e29b-41d4-a716-446655440009';
        
        // Create some chat history
        Chat::create([
            'user_id' => $this->user->id,
            'session_id' => $sessionId,
            'message' => 'First message',
            'type' => 'user',
            'metadata' => ['ip_address' => '127.0.0.1'],
        ]);

        Chat::create([
            'user_id' => null,
            'session_id' => $sessionId,
            'message' => 'Bot response',
            'type' => 'bot',
            'metadata' => ['ip_address' => '127.0.0.1'],
        ]);

        $response = $this->get('/chat/' . $sessionId);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('chat')
                ->has('chatHistory', 2)
                ->where('sessionId', $sessionId)
        );
    }

    public function test_dashboard_shows_chat_statistics(): void
    {
        $this->actingAs($this->user);
        
        // Create some chat data
        $sessionId = '550e8400-e29b-41d4-a716-446655440010';
        Chat::factory()->user()->create([
            'user_id' => $this->user->id,
            'session_id' => $sessionId,
            'message' => 'Tell me a joke',
        ]);
        
        Chat::factory()->bot()->create([
            'session_id' => $sessionId,
        ]);

        $response = $this->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->component('dashboard')
                ->has('userStats')
                ->has('globalStats')
                ->where('userStats.total_conversations', 1)
                ->where('userStats.total_messages', 1)
        );
    }
}