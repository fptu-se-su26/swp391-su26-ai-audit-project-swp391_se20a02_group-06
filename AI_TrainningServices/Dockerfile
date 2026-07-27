# Sử dụng Python image chính thức và nhẹ nhàng
FROM python:3.11-slim

# Cài đặt thư mục làm việc trong container
WORKDIR /app

# Copy requirements.txt vào container
COPY requirements.txt .

# Cài đặt các thư viện cần thiết
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn của AI service vào container
COPY . .

# Mở cổng 8000
EXPOSE 8000

# Chạy server FastAPI bằng Gunicorn để tối ưu cho production
CMD ["gunicorn", "fitness_training:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
