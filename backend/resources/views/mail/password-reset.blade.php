<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ __('mail.password_reset.title') }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff9800; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 20px; }
        .button { display: inline-block; background-color: #ff9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .token { background-color: #e0e0e0; padding: 10px; border-radius: 3px; word-break: break-all; font-family: monospace; margin-top: 10px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 3px; margin-top: 15px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ __('mail.password_reset.title') }}</h1>
        </div>

        <div class="content">
            <p>{{ __('mail.password_reset.greeting') }}</p>

            <p>{{ __('mail.password_reset.request') }}</p>

            <p>{{ __('mail.password_reset.instruction') }}</p>

            <p>
                <a href="{{ $resetUrl }}" class="button">
                    {{ __('mail.password_reset.button') }}
                </a>
            </p>

            <p><strong>{{ __('mail.password_reset.token_label') }}</strong></p>
            <div class="token">{{ $resetToken }}</div>

            <div class="warning">
                <strong>⏰ {{ __('mail.password_reset.warning') }}</strong> {{ __('mail.password_reset.expires') }}
            </div>

            <p>{{ __('mail.password_reset.not_requested') }}</p>

            <p>{{ __('mail.password_reset.regards') }}<br><strong>{{ __('mail.password_reset.team') }}</strong></p>
        </div>

        <div class="footer">
            <p>&copy; {{ __('mail.password_reset.copyright', ['year' => date('Y')]) }}</p>
        </div>
    </div>
</body>
</html>
    </div>
</body>
</html>