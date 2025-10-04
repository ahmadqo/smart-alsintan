<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \App\Http\Middleware\ApiResponseMiddleware::class,
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->alias([
            // 'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->expectsJson()) {
                $status = 500;
                $message = 'Terjadi kesalahan pada server';
                $errors = null;

                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    $status = 401;
                    $message = 'Tidak terautentikasi';
                } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException) {
                    $status = 403;
                    $message = 'Tidak memiliki izin';
                } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    $status = 404;
                    $message = 'Endpoint tidak ditemukan';
                } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException) {
                    $status = 405;
                    $message = 'Metode HTTP tidak diizinkan';
                } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                    $status = 422;
                    $message = 'Validasi gagal';
                    $errors = $e->errors();
                } else {
                    if (app()->environment('local')) {
                        $message = $e->getMessage();
                    }
                }

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'errors' => $errors,
                ], $status);
            }
        });
    })->create();
