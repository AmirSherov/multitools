"""
Модуль для статистики пользователей в Multitools.

Этот модуль предоставляет функции для отслеживания использования инструментов
и получения статистических данных для пользователей.

Пример использования:
    
    from authentication.stats import track_tool_usage
    
    class YourToolView(APIView):
        def post(self, request):
            # Вызов функции в самом начале обработки запроса
            track_tool_usage(request, 'your_tool_name')
            
            # Основная логика инструмента
            ...
            
            return Response(...)
"""

from .models import UserStats, UserToken
import traceback
from django.utils import timezone

def track_tool_usage(request, tool_name):
    """
    Универсальная функция для отслеживания использования инструментов.
    
    Эта функция автоматически:
    1. Определяет пользователя из запроса или токена
    2. Создает объект статистики, если он не существует
    3. Увеличивает счетчик запросов
    4. Обновляет последний использованный инструмент
    5. Обновляет время последней активности
    6. Обновляет счетчик использования инструмента в top_tools
    
    Аргументы:
        request (HttpRequest): объект запроса Django/DRF
        tool_name (str): название используемого инструмента
        
    Возвращает:
        bool: True если статистика обновлена успешно, иначе False
        
    Пример:
        track_tool_usage(request, 'download_instagram')
    """
    print(f"[STATS] Трекинг использования инструмента: {tool_name}")
    
    # Получаем пользователя из request или из токена
    user = get_user_from_request(request)
    
    if not user:
        print(f"[STATS] Невозможно определить пользователя")
        return False
        
    try:
        stats, created = UserStats.objects.get_or_create(user=user)
        old_requests = stats.total_requests
        old_tool = stats.last_tool
        stats.update_tool(tool_name)
        
        print(f"[STATS] Обновлена статистика для {user.username}: запросы {old_requests} -> {stats.total_requests}, инструмент: {old_tool} -> {stats.last_tool}")
        return True
    except Exception as e:
        print(f"[STATS] Ошибка при обновлении статистики: {e}")
        print(traceback.format_exc())
        return False

def get_user_from_request(request):
    """
    Извлекает объект пользователя из запроса.
    Сначала проверяет request.user, затем пытается получить пользователя по токену.
    
    Аргументы:
        request (HttpRequest): объект запроса Django/DRF
        
    Возвращает:
        User: объект пользователя или None
    """
    if hasattr(request, 'user') and request.user.is_authenticated:
        print(f"[STATS] Пользователь получен из request.user: {request.user.username}")
        return request.user
    
    try:
        auth_header = request.headers.get('Authorization', '')
        if auth_header and auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            token = UserToken.objects.filter(token=token_key, is_active=True).first()
            
            if token and token.is_valid():
                print(f"[STATS] Пользователь получен из токена: {token.user.username} (id={token.user.id})")
                return token.user
    except Exception as e:
        print(f"[STATS] Ошибка при получении пользователя из токена: {e}")
        
    return None

def get_user_stats_summary(user):
    """
    Возвращает сводку статистики пользователя для API.
    
    Эта функция используется в API для получения статистических данных
    о пользователе в формате, подходящем для клиентов.
    
    Аргументы:
        user (User): объект пользователя
        
    Возвращает:
        dict: словарь с данными статистики со следующими ключами:
            - total_requests: общее количество запросов
            - last_tool: последний использованный инструмент
            - last_active: время последней активности
            - top3_tools: список топ-3 инструментов в формате [(название, количество), ...]
    """
    try:
        stats, created = UserStats.objects.get_or_create(user=user)
        top3 = stats.get_top3()
        
        return {
            'total_requests': stats.total_requests,
            'last_tool': stats.last_tool,
            'last_active': stats.last_active,
            'top3_tools': top3,
        }
    except Exception as e:
        print(f"[STATS] Ошибка при получении сводки статистики: {e}")
        return {
            'total_requests': 0,
            'last_tool': '',
            'last_active': None,
            'top3_tools': [],
        } 