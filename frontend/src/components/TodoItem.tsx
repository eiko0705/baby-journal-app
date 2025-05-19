import React from 'react'
import { ListItem, ListItemText, IconButton, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Todo } from '../types'

interface TodoItemProps {
    todo: Todo
    onToggleComplete: (id: string) => void
    onDeleteTodo: (id: string) => void
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDeleteTodo }) => {
    return (
        <ListItem
            divider
            secondaryAction={
                <IconButton edge="end"
                    aria-label="delete-task"
                    onClick={() => onDeleteTodo(todo.id)}
                >
                    <DeleteIcon />
                </IconButton>
            }
        >
            <Checkbox
                edge="start"
                checked={todo.completed}
                onClick={() => onToggleComplete(todo.id)}
                disableRipple
                aria-labelledby={`toggle-item-text-${todo.id}`}
            />
            <ListItemText
                id={`toggle-item-text-${todo.id}`}
                primary={todo.text}
                sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                }}
            />
        </ListItem>
    )
}

export default TodoItem
