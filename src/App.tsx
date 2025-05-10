import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import './App.css'
import ChildBirthdayInput from './features/childProfile/ChildBirthdayInput'

function App() {

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Mameko　App
        </Typography>
        <ChildBirthdayInput />
      </Box>
    </Container>
  )
}

export default App
