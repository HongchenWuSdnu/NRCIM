@echo off
echo 启动自然资源地理信息分类分级与多尺度安全指标体系构建系统...

echo 安装后端依赖...
npm install

echo 安装前端依赖...
cd client
npm install
cd ..

echo 启动后端服务器...
start cmd /k "npm start"

echo 等待后端服务器启动...
timeout /t 3 /nobreak > nul

echo 启动前端开发服务器...
cd client
start cmd /k "npm start"

echo 系统启动完成！
echo 后端服务器运行在: http://localhost:3001
echo 前端应用运行在: http://localhost:3000
echo.
echo 请等待前端编译完成后访问: http://localhost:3000
pause 