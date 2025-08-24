import './Counter.css'

function Counter({ count, setCount }) {
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)
  const reset = () => setCount(0)

  return (
    <div className="counter">
      <h3>计数器示例</h3>
      <div className="counter-display">
        <span className="count-value">{count}</span>
      </div>
      <div className="counter-buttons">
        <button onClick={decrement} className="btn btn-decrement">-</button>
        <button onClick={reset} className="btn btn-reset">重置</button>
        <button onClick={increment} className="btn btn-increment">+</button>
      </div>
    </div>
  )
}

export default Counter
