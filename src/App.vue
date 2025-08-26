<template>
  <div id="app">
    <h1>Vue 3 示例应用</h1>
    <p>欢迎使用 Vue 3！</p>
    
    <!-- API 集成部分 -->
    <div class="api-section" v-if="!isLoggedIn">
      <h2>API 登录</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="login-form">
        <input 
          v-model="loginData.username" 
          placeholder="用户名"
          @keyup.enter="login"
        >
        <input 
          v-model="loginData.password" 
          type="password"
          placeholder="密码"
          @keyup.enter="login"
        >
        <button @click="login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>
    </div>

    <div class="api-section" v-else>
      <h2>API 待办事项 <button @click="logout" class="logout-btn">退出</button></h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="api-todo">
        <input 
          v-model="newTodo" 
          @keyup.enter="addApiTodo"
          placeholder="输入API待办事项..."
          :disabled="loading"
        >
        <button @click="addApiTodo" :disabled="loading || !newTodo.trim()">
          {{ loading ? '添加中...' : '添加' }}
        </button>
        <button @click="fetchTodos" :disabled="loading">刷新</button>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <ul v-if="apiTodos.length > 0">
        <li v-for="todo in apiTodos" :key="todo.id">
          {{ todo.title }}
          <button @click="removeApiTodo(todo.id)" :disabled="loading">删除</button>
        </li>
      </ul>
      <p v-else-if="!loading">暂无待办事项</p>
    </div>

    <!-- 本地功能部分 -->
    <div class="counter">
      <h2>计数器示例</h2>
      <p>当前计数: {{ count }}</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <button @click="reset">重置</button>
    </div>

    <div class="todo">
      <h2>本地待办事项示例</h2>
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="输入本地待办事项..."
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
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const count = ref(0)
    const newTodo = ref('')
    const todos = ref([])
    const apiTodos = ref([])
    const loading = ref(false)
    const error = ref('')
    const authToken = ref(localStorage.getItem('authToken') || '')
    const loginData = ref({
      username: '',
      password: ''
    })
    const isLoggedIn = ref(!!authToken.value)

    const API_BASE_URL = null // Disabled for deployment

    // 本地待办事项功能
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

    // API 集成功能
    const login = async () => {
      try {
        loading.value = true
        error.value = ''
        const response = await fetch(`${API_BASE_URL}/api/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData.value)
        })

        const data = await response.json()
        
        if (response.ok && data.token) {
          authToken.value = data.token
          localStorage.setItem('authToken', data.token)
          isLoggedIn.value = true
          error.value = ''
          await fetchTodos()
        } else {
          error.value = data.message || '登录失败'
        }
      } catch (err) {
        error.value = '网络错误，请检查API服务器'
      } finally {
        loading.value = false
      }
    }

    const logout = () => {
      authToken.value = ''
      localStorage.removeItem('authToken')
      isLoggedIn.value = false
      apiTodos.value = []
    }

    const fetchTodos = async () => {
      if (!authToken.value) return

      try {
        loading.value = true
        const response = await fetch(`${API_BASE_URL}/api/todos`, {
          headers: {
            'Authorization': `Bearer ${authToken.value}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          apiTodos.value = data.todos || []
        } else {
          error.value = '获取待办事项失败'
        }
      } catch (err) {
        error.value = '获取待办事项时发生错误'
      } finally {
        loading.value = false
      }
    }

    const addApiTodo = async () => {
      if (!newTodo.value.trim() || !authToken.value) return

      try {
        loading.value = true
        const response = await fetch(`${API_BASE_URL}/api/todos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken.value}`
          },
          body: JSON.stringify({
            title: newTodo.value.trim(),
            completed: false
          })
        })

        if (response.ok) {
          newTodo.value = ''
          await fetchTodos()
        } else {
          error.value = '添加待办事项失败'
        }
      } catch (err) {
        error.value = '添加待办事项时发生错误'
      } finally {
        loading.value = false
      }
    }

    const removeApiTodo = async (id) => {
      try {
        loading.value = true
        const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken.value}`
          }
        })

        if (response.ok) {
          await fetchTodos()
        } else {
          error.value = '删除待办事项失败'
        }
      } catch (err) {
        error.value = '删除待办事项时发生错误'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (isLoggedIn.value) {
        fetchTodos()
      }
    })

    return {
      count,
      newTodo,
      todos,
      apiTodos,
      loading,
      error,
      loginData,
      isLoggedIn,
      increment,
      decrement,
      reset,
      addTodo,
      removeTodo,
      login,
      logout,
      addApiTodo,
      removeApiTodo,
      fetchTodos
    }
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.api-section, .counter, .todo {
  margin: 25px 0;
  padding: 25px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.api-section {
  background: rgba(255, 255, 255, 0.98);
  border-left: 5px solid #667eea;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form, .api-todo {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 350px;
  margin: 0 auto;
}

.login-form input, .api-todo input {
  padding: 12px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.login-form input:focus, .api-todo input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

button:disabled {
  background: #bdc3c7;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

.logout-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  font-size: 12px;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #ee5a52 0%, #d63031 100%);
  transform: translateY(-1px);
}

.error {
  color: #e74c3c;
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  border-left: 4px solid #e74c3c;
  font-weight: 500;
}

.loading {
  color: #7f8c8d;
  font-style: italic;
  margin: 15px 0;
  text-align: center;
  font-size: 1.1rem;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

li {
  padding: 15px 20px;
  margin: 10px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

li:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

li button {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  padding: 6px 12px;
  font-size: 12px;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
}

li button:hover {
  background: linear-gradient(135deg, #ee5a52 0%, #d63031 100%);
  transform: translateY(-1px);
}

.counter p {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 15px 0;
}

.todo input {
  padding: 12px 15px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  margin-right: 10px;
  background: white;
  transition: all 0.3s ease;
}

.todo input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  #app {
    padding: 20px 15px;
  }
  
  .api-section, .counter, .todo {
    padding: 20px;
    margin: 20px 0;
  }
  
  .login-form, .api-todo {
    max-width: 100%;
  }
  
  h1 {
    font-size: 2rem;
  }
}
</style>
