<template>
  <section class="real-app">
    <input 
      type="text" 
      class="add-input" 
      autofocus
      placeholder="下一步的计划..."
      @keyup.enter="addTodo"
    >
    <item
      :todo="todo"
      v-for="todo in filtedTodos"
      :key="todo.id"
      @del="deleteTodo"
    />
    <tabs 
      :filter="filter" 
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    />
  </section>
</template>

<script>
import Item from './item.vue';
import Tabs from './tabs.vue';
let id = 0;
export default {
  data() {
    return {
      todos: [],
      filter: "all"
    }
  },
  components: {
    Item,
    Tabs
  },
  computed: {
    filtedTodos() {
      if(this.filter === 'all') {
        return this.todos;
      }
      const completed =  this.filter === 'completed';
      return this.todos.filter(todo => todo.completed === completed);
    }
  },
  methods: {
    addTodo(e) {
      if(!e.target.value.trim()){
        return false;
      }
      this.todos.unshift(
        {
          id: id++,
          content: e.target.value.trim(),
          completed: false
        }
      );
      e.target.value = "";
    },
    deleteTodo(id) {
      this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1);
    },
    toggleFilter(state) {
      this.filter = state;
    },
    clearAllCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed);
    }
  }
}
</script>

<style lang="stylus" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

.add-input {
  position: relative;
  margin: 0 auto;
  width: 100%;
  font-size: 24px;
  line-height: 16px;
  outline: none;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 #666666;
  box-sizing: border-box;
  padding: 16px 16px 16px 60px;
}
</style>

