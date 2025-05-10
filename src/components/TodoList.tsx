import React from 'react'
import { List, Typography, Box } from '@mui/material'
import TodoItem from './TodoItem'
import type { Todo } from '../types'

interface TodoListProps {
    todos: Todo[]
    onToggleComplete: (id: string) => void
    onDeleteTodo: (id: string) => void
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDeleteTodo }) => {
    if (todos.length === 0) {
        return (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography color="textSecondary" >No todos yet. Add one!</Typography>
            </Box>
        )
    }
    
    return (
        <List>
            {todos.map((todo) => (
                <TodoItem 
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onDeleteTodo={onDeleteTodo}
                />
            ))} 
        </List>
    )
}

export default TodoList
