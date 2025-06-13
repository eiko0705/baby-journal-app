import React from 'react'
import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material'
import './App.css'
import ChildBirthdayInput from './features/childProfile/ChildBirthdayInput'
import AddAchievementForm from './features/achievements/components/AddAchievementForm'
import AchievementsList from './features/achievements/components/AchievementsList'

function App() {

  return (
    <>
      <AppBar 
        position="static"
        sx={{
          backgroundColor: '#A2E4B8',
          color: '#4A4A4A',
          boxShadow: '0 2px 4px rgba(162, 228, 184, 0.2)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component='div' 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: '#4A4A4A'
            }}
          >
            Mameko App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="md"
        sx={{
          backgroundColor: '#F8F8F8',
          minHeight: '100vh',
          py: 3
        }}
      >
        <Box sx={{ my: 4 }}>
          <ChildBirthdayInput />
          <AddAchievementForm />
          <AchievementsList />
        </Box>
      </Container>
    </>
  )
}

export default App
