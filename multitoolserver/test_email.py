import os
import django
import sys

# Настраиваем окружение Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'multitoolserver.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    subject = 'Тестовое письмо от MultiTools'
    message = 'Это тестовое письмо для проверки настройки SMTP'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [input('Введите ваш email для тестирования: ')]
    
    # HTML версия письма для теста
    html_message = '''
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Тестовое письмо</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { border: 1px solid #ddd; border-radius: 5px; padding: 20px; background-color: #f9f9f9; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #5046e5; }
            .test-code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 30px 0; color: #5046e5; }
            .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">MultiTools</div>
                <h2>Тестовое письмо</h2>
            </div>
            <p>Здравствуйте!</p>
            <p>Это тестовое письмо для проверки работы настроек SMTP в приложении MultiTools.</p>
            <div class="test-code">123456</div>
            <p>Если вы видите это письмо, значит отправка писем настроена правильно!</p>
            <div class="footer">
                &copy; 2025 MultiTools. Все права защищены.
            </div>
        </div>
    </body>
    </html>
    '''
    
    print(f'Отправка тестового письма на {recipient_list[0]}...')
    
    try:
        result = send_mail(
            subject, 
            message, 
            from_email, 
            recipient_list, 
            html_message=html_message
        )
        if result:
            print('Письмо успешно отправлено!')
        else:
            print('Ошибка отправки письма.')
    except Exception as e:
        print(f'Ошибка отправки письма: {e}')

if __name__ == '__main__':
    test_email() 