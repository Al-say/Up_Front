<template>
  <div id="app">
    <h1>Vue 3 示例应用</h1>
    <p>欢迎使用 Vue 3！</p>
    
    <div class="counter">
      <h2>计数器示例</h2>
      <p>当前计数: {{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <button @click="reset">重置</button>
    </div>

    <div class="todo">
      <h2>待办事项示例</h2>
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="输入待办事项..."
      >
      <ul>
        <li v-for="(todo, index) in todos" :key="index">
          {{ todo }}
          <button @click="removeTodo(index)">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const count = ref(0)
    const newTodo = ref('')
    const todos = ref([])

    const increment = () => {
      count.value++
    }

    const decrement = () => {
      count.value--
    }

    const reset = () => {
      count.value = 0
    }

    const addTodo = () => {
      if (newTodo.value.trim()) {
        todos.value.push(newTodo.value.trim())
        newTodo.value = ''
      }
    }

    const removeTodo = (index) => {
      todos.value.splice(index, 1)
    }

    return {
      count,
      newTodo,
      todos,
      increment,
      decrement,
      reset,
      addTodo,
      removeTodo
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.counter, .todo {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px;
  margin: 5px 0;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
