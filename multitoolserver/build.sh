#!/usr/bin/env bash
# Выход при ошибке
set -o errexit

# Установка ffmpeg
apt-get update -y
apt-get install -y ffmpeg

# Стандартные операции сборки Django
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate 