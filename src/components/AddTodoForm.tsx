import React, { useState } from 'react'
import { TextField, Button, Box } from '@mui/material'

interface AddTodoFormProps {
  onAddTodo: (text: string) => void
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim()) return
    onAddTodo(text)
    setText('')
  }

  return (
    <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1, mb: 2 }}
    >
        <TextField
            label="Add a new todo"
            variant="outlined"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            size='small'
            required
        />
        <Button type="submit" variant="contained" color="primary">
            Add
        </Button>
    </Box>
  )
}

export default AddTodoForm
