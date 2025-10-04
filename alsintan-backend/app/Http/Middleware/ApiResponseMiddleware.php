<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiResponseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');

        $response = $next($request);

        // Jika 500 error, ubah juga ke JSON agar konsisten
        if ($response->getStatusCode() >= 500 && !$response->headers->get('Content-Type')) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server',
            ], 500);
        }

        return $response;
    }
}
