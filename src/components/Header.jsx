import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">Up Front</h1>
        <nav className="nav">
          <a href="#home" className="nav-link">首页</a>
          <a href="#features" className="nav-link">特性</a>
          <a href="#about" className="nav-link">关于</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
