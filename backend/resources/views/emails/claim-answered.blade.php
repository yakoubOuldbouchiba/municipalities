<!DOCTYPE html>
<html dir="{{ in_array($language, ['ar']) ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <title>{{ __('mail.claim_answered.title') }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        
        body { 
            font-family: 'Cairo', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
        }
        
        @supports (direction: rtl) {
            body[dir="rtl"] { direction: rtl; text-align: right; }
            body[dir="ltr"] { direction: ltr; text-align: left; }
        }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background-color: #f9f9f9; border-radius: 5px; margin-top: 20px; }
        .button { display: inline-block; background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .response-box { 
            background-color: #e3f2fd; 
            padding: 15px; 
            margin-top: 15px; 
            border-radius: 3px; 
            border-left: 4px solid #2196F3;
        }
        [dir="rtl"] .response-box {
            border-left: none;
            border-right: 4px solid #2196F3;
        }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ __('mail.claim_answered.title') }}</h1>
        </div>

        <div class="content">
            <p>{{ __('mail.claim_answered.greeting', ['name' => $recipientName]) }}</p>

            <p>{{ __('mail.claim_answered.thank_you', ['claimType' => $claimType]) }}</p>

            <div class="response-box">
                <strong>{{ __('mail.claim_answered.response_label') }}</strong><br>
                {{ $answer }}
            </div>

            <p>{{ __('mail.claim_answered.further_questions') }}</p>

            <p>
                <a href="{{ config('app.url') }}" class="button">
                    {{ __('mail.claim_answered.button') }}
                </a>
            </p>

            <p>{{ __('mail.claim_answered.regards') }}<br><strong>{{ __('mail.claim_answered.team') }}</strong></p>
        </div>

        <div class="footer">
            <p>{{ __('mail.claim_answered.copyright', ['year' => date('Y')]) }}</p>
        </div>
    </div>
</body>
</html>
