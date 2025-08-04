<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChatRequest;
use App\Models\Chat;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        private ChatService $chatService
    ) {}

    /**
     * Display the chat interface.
     */
    public function index(Request $request)
    {
        $sessionId = $request->get('session_id');
        $chatHistory = [];
        
        if ($sessionId) {
            $chatHistory = $this->chatService->getChatHistory($sessionId);
        }
        
        return Inertia::render('chat', [
            'chatHistory' => $chatHistory,
            'sessionId' => $sessionId,
        ]);
    }

    /**
     * Store a new chat message and generate bot response.
     */
    public function store(StoreChatRequest $request)
    {
        $messages = $this->chatService->processMessage(
            $request->validated(),
            $request
        );

        // Get updated chat history
        $chatHistory = $this->chatService->getChatHistory($request->session_id);

        return Inertia::render('chat', [
            'chatHistory' => $chatHistory,
            'sessionId' => $request->session_id,
        ]);
    }

    /**
     * Get chat history for a specific session.
     */
    public function show(string $sessionId)
    {
        $chatHistory = $this->chatService->getChatHistory($sessionId);
        
        return Inertia::render('chat', [
            'chatHistory' => $chatHistory,
            'sessionId' => $sessionId,
        ]);
    }
}