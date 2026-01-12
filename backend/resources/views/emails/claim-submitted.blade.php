<!DOCTYPE html>
<html dir="{{ in_array($language, ['ar']) ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <title>{{ __('mail.claim_submitted.title') }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        
        body { 
            font-family: 'Cairo', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
        }
        html[dir="rtl"] body {
            direction: rtl;
            text-align: right;
        }
        html[dir="ltr"] body {
            direction: ltr;
            text-align: left;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background: #f9f9f9; 
        }
        .header { 
            background: #007bff; 
            color: white; 
            padding: 20px; 
            text-align: center; 
            margin-bottom: 20px; 
        }
        .content { 
            background: white; 
            padding: 20px; 
            border-radius: 5px; 
        }
        .footer { 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
            margin-top: 20px; 
        }
        .button { 
            display: inline-block; 
            padding: 10px 20px; 
            background: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin-top: 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ __('mail.claim_submitted.title') }}</h1>
        </div>
        <div class="content">
            <p>{{ __('mail.claim_submitted.greeting', ['name' => $recipientName]) }}</p>
            
            <p>{{ __('mail.claim_submitted.thank_you', ['claimType' => $claimType]) }}</p>
            
            <h2>{{ __('mail.claim_submitted.details_label') }}</h2>
            <p>{{ $claimContent }}</p>
            
            <p>{{ __('mail.claim_submitted.response_notice') }}</p>
            
            <center>
                <a href="{{ config('app.url') }}" class="button">{{ __('mail.claim_submitted.button') }}</a>
            </center>
        </div>
        <div class="footer">
            <p>{{ __('mail.claim_submitted.regards') }}<br><strong>{{ __('mail.claim_submitted.team') }}</strong></p>
            <p>{{ __('mail.claim_submitted.copyright', ['year' => date('Y')]) }}</p>
        </div>
    </div>
</body>
</html>
