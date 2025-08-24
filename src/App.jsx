import { useState } from 'react'
import Header from './components/Header'
import Counter from './components/Counter'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <h1>欢迎使用 Up Front</h1>
        <p>这是一个现代化的 React + Vite 前端项目</p>
        
        <Counter count={count} setCount={setCount} />
        
        <div className="features">
          <h2>项目特性</h2>
          <ul>
            <li>⚡️ 快速的 Vite 构建工具</li>
            <li>⚛️ React 18 最新特性</li>
            <li>🎨 现代化的 CSS 样式</li>
            <li>📱 响应式设计</li>
            <li>🧪 测试框架集成</li>
            <li>🔧 ESLint 代码规范</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
