<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ __('mail.welcome.title') }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 20px; }
        .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ __('mail.welcome.title') }} 🎉</h1>
        </div>

        <div class="content">
            <p>{{ __('mail.welcome.greeting', ['name' => $user->name]) }}</p>

            <p>{{ __('mail.welcome.account_created') }}</p>

            <p>{{ __('mail.welcome.credentials') }}</p>
            <ul>
                <li><strong>{{ __('mail.welcome.email') }}:</strong> {{ $user->email }}</li>
                <li><strong>{{ __('mail.welcome.password') }}:</strong> {{ $password }}</li>
            </ul>

            <p>
                <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/login" class="button">
                    {{ __('mail.welcome.button') }}
                </a>
            </p>

            <p>{{ __('mail.welcome.questions') }}</p>

            <p>{{ __('mail.welcome.regards') }}<br><strong>{{ __('mail.welcome.team') }}</strong></p>
        </div>

        <div class="footer">
            <p>&copy; {{ __('mail.welcome.copyright', ['year' => date('Y')]) }}</p>
        </div>
    </div>
</body>
</html>