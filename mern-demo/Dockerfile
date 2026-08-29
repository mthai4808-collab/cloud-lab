# Câu 32: Khai báo Node.js làm Base Image (Nên dùng bản alpine cho nhẹ)
FROM node:20-alpine

# Câu 33: Thiết lập thư mục làm việc bên trong Container
WORKDIR /app

# Câu 34: Sao chép các file định nghĩa thư viện vào Container
COPY package.json package-lock.json ./

# Câu 35: Cài đặt các package Node.js
RUN npm install

# Câu 36: Sao chép toàn bộ mã nguồn Backend còn lại vào Container
COPY . .

# Câu 37: Khai báo port 5000
EXPOSE 5000

# Câu 38: Lệnh khởi động khi Container chạy
CMD ["npm", "start"]