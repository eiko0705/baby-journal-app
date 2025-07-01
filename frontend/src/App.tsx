import React from 'react'
import { Container, Typography, Box, AppBar, Toolbar, Paper } from '@mui/material'
import './App.css'
import ChildProfileForm from './features/childProfile/ChildProfileForm'
import AddAchievementForm from './features/achievements/components/AddAchievementForm'
import AchievementsList from './features/achievements/components/AchievementsList'

function App() {

  return (
    <>
      <AppBar 
        position="fixed"
        color='primary'
        sx={{
          color: 'contrastText',
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
            }}
          >
            Mameko App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="md"
        sx={{
          backgroundColor: 'default',
          minHeight: '100vh',
          py: 3
        }}
      >
        <Box sx={{ my: 4 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <ChildProfileForm />
          </Paper>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <AddAchievementForm />
          </Paper>
          <Paper elevation={2} sx={{ p: 3 }}>
            <AchievementsList />
          </Paper>
        </Box>
      </Container>
    </>
  )
}

export default App
