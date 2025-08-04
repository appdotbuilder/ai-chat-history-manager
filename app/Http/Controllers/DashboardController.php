<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get chat statistics
        $stats = [
            'total_conversations' => Chat::where('user_id', $user->id)
                ->distinct('session_id')
                ->count('session_id'),
            'total_messages' => Chat::where('user_id', $user->id)
                ->where('type', 'user')
                ->count(),
            'recent_chats' => Chat::with('user')
                ->where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get(),
            'popular_topics' => $this->getPopularTopics($user->id),
        ];

        // Get global stats (for admin view)
        $globalStats = [
            'total_users_chatting' => Chat::distinct('user_id')->count('user_id'),
            'total_messages_today' => Chat::whereDate('created_at', today())->count(),
            'active_sessions' => Chat::where('created_at', '>=', now()->subHours(24))
                ->distinct('session_id')
                ->count('session_id'),
        ];

        return Inertia::render('dashboard', [
            'userStats' => $stats,
            'globalStats' => $globalStats,
        ]);
    }

    /**
     * Get popular chat topics based on message content.
     */
    protected function getPopularTopics(int $userId): array
    {
        $messages = Chat::where('user_id', $userId)
            ->where('type', 'user')
            ->pluck('message');

        $topics = [];
        foreach ($messages as $message) {
            $message = strtolower($message);
            
            if (str_contains($message, 'joke') || str_contains($message, 'funny')) {
                $topics['humor'] = ($topics['humor'] ?? 0) + 1;
            }
            if (str_contains($message, 'cook') || str_contains($message, 'recipe')) {
                $topics['cooking'] = ($topics['cooking'] ?? 0) + 1;
            }
            if (str_contains($message, 'help') || str_contains($message, 'assist')) {
                $topics['assistance'] = ($topics['assistance'] ?? 0) + 1;
            }
            if (str_contains($message, 'weather') || str_contains($message, 'temperature')) {
                $topics['weather'] = ($topics['weather'] ?? 0) + 1;
            }
            if (str_contains($message, 'technology') || str_contains($message, 'computer')) {
                $topics['technology'] = ($topics['technology'] ?? 0) + 1;
            }
        }

        arsort($topics);
        return array_slice($topics, 0, 5);
    }
}