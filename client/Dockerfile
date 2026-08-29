# Câu 51: Sử dụng Node.js làm Base Image để build ứng dụng React
FROM node:20-alpine AS builder

# Câu 52: Thiết lập thư mục làm việc
WORKDIR /app

# Câu 53: Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Câu 54: Cài đặt thư viện
RUN npm install

# Câu 55: Sao chép toàn bộ mã nguồn Frontend
COPY . .

# Câu 56 & 57: Build ứng dụng React (tạo ra thư mục dist hoặc build)
RUN npm run build

# --- Giai đoạn 2: Sử dụng Nginx để phục vụ file tĩnh ---
FROM nginx:alpine

# Sao chép kết quả build từ giai đoạn 1 vào thư mục chứa web của Nginx
# (Lưu ý: Nếu dùng Vite thì thư mục là dist, nếu dùng Create React App thì thay thành build)
COPY --from=builder /app/dist /usr/share/nginx/html

# Khai báo port 80 mặc định của Nginx
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]