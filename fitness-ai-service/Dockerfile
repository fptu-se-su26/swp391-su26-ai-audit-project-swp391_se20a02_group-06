FROM python:3.10-slim

WORKDIR /app

# Sao chép requirements trước để tận dụng Docker cache layer
COPY requirements.txt .

# Cài đặt các thư viện cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng 8000
EXPOSE 8000

# Chạy ứng dụng FastAPI qua Uvicorn
CMD ["uvicorn", "nutrition:app", "--host", "0.0.0.0", "--port", "8000"]
