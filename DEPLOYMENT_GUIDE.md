# Vue.js 项目部署指南

## 项目已构建完成

构建文件位于 `dist/` 目录中，包含：
- `index.html` - 主页面文件
- `assets/index-B5Wo0uQj.css` - 样式文件
- `assets/index-CQ6uHGl9.js` - JavaScript 文件

## 部署到自有服务器

### 方法一：使用 FTP/SFTP 上传

1. **准备服务器环境**：
   - 确保服务器已安装 Web 服务器（如 Nginx、Apache）
   - 确保服务器支持静态文件服务

2. **上传文件**：
   ```bash
   # 使用 scp 上传（示例）
   scp -r dist/* username@your-server.com:/path/to/web/root/
   
   # 或者使用 rsync
   rsync -avz dist/ username@your-server.com:/path/to/web/root/
   ```

3. **配置 Web 服务器**：

**Nginx 配置示例**：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/web/root;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache 配置示例**（.htaccess）：
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# 静态资源缓存
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>
```

### 方法二：使用 Git 部署（如果服务器支持）

1. **在服务器上设置 Git 接收钩子**
2. **配置自动部署脚本**

### 方法三：使用 Docker 容器化部署

创建 `Dockerfile`：
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

创建 `nginx.conf`：
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

构建和运行：
```bash
docker build -t vue-app .
docker run -d -p 80:80 --name vue-app-container vue-app
```

## 验证部署

部署完成后，访问您的服务器地址验证应用是否正常工作：
- 检查页面是否能正常加载
- 测试计数器功能
- 测试待办事项功能

## 故障排除

1. **404 错误**：确保服务器配置了正确的重写规则（单页应用需要）
2. **资源加载失败**：检查文件路径和权限
3. **CORS 问题**：如果使用 API，配置正确的 CORS 头

## 后续维护

1. **更新部署**：重新构建项目并上传新的 dist 文件
2. **版本控制**：建议使用 Git 标签管理不同版本
3. **备份**：定期备份部署的文件

## 性能优化建议

1. 启用 Gzip 压缩
2. 配置 CDN 加速静态资源
3. 启用 HTTP/2
4. 设置合适的缓存策略
