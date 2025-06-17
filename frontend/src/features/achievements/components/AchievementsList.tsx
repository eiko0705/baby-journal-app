    import React, { useEffect, useState } from 'react'
    import { useSelector, useDispatch } from 'react-redux'
    import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Paper, CircularProgress, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material'
    import DeleteIcon from '@mui/icons-material/Delete'
    import EditIcon from '@mui/icons-material/Edit'
    import {
        fetchAchievements,
        deleteAchievement,
        updateAchievement,
        selectAllAchievements,
        selectAchievementsStatus,
        selectAchievementsError
    } from '../achievementsSlice'
    import type { Achievement, Age, NewAchievementPayload } from '../../../types'
    import type { AppDispatch } from '../../../app/store'
    import EditAchievementModal from './EditAchievementModal'
    import { formatAge } from '../../../utils/dateUtils'

    const AchievementsList: React.FC = () => {
        const achievements = useSelector(selectAllAchievements)
        const dispatch: AppDispatch = useDispatch()
        const status = useSelector(selectAchievementsStatus)
        const error = useSelector(selectAchievementsError)

        const [openDialog, setOpenDialog] = useState(false)
        const [selectedAchievementIdForDelete, setSelectedAchievementIdForDelete] = useState<string | null>(null)

        const [openEditModal, setOpenEditModal] = useState(false)
        const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)

        useEffect(() => {
            if (status === 'idle') {
                dispatch(fetchAchievements())
            }
        }, [status, dispatch])

        const handleDeleteClick = (id: string) => {
            setSelectedAchievementIdForDelete(id)
            setOpenDialog(true)
        }

        const handleCloseDialog = () => {
            setOpenDialog(false)
            setSelectedAchievementIdForDelete(null)
        }

        const handleConfirmDelete = async () => {
            if (selectedAchievementIdForDelete) {
                try {
                    await dispatch(deleteAchievement(selectedAchievementIdForDelete)).unwrap()
                } catch (error) {
                    console.error('Error deleting achievement:', error)
                    alert(`Failed to delete achievement. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`)
                } finally {
                    handleCloseDialog()
                }
            }
        }

        const handleEditClick = (achievement: Achievement) => {
            setEditingAchievement(achievement)
            setOpenEditModal(true)
        }

        const handleCloseEditModal = () => {
            setOpenEditModal(false)
            setEditingAchievement(null)
        }

        const handleSaveEdit = async (id: string, data: NewAchievementPayload) => {
            try {
                await dispatch(updateAchievement({ id, achievementData: data})).unwrap()
                handleCloseEditModal()
            } catch (error) {
                console.error('Error updating achievement:', error)
                alert(`Failed to update achievement. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`)
            }
        }

        if (status === 'loading' && achievements.length === 0) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            )
        }

        if (status === 'failed' && achievements.length === 0) {
            return (
                <Typography color='error' sx={{ mt: 2, textAlign: 'center' }}>
                    Error: {error}
                </Typography>
            )
        }

        if (achievements.length === 0 && status === 'succeeded') {
            return (
                <Typography color='text.secondary' sx={{ mt: 2, textAlign: 'center' }}>
                    There are no achievements yet.
                </Typography>
            )
        }

        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6' gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                    Achievement List
                </Typography>
                {status === 'loading' && <CircularProgress size={20} sx={{ display: 'block', margin: '0 auto' }} />}
                <Paper 
                    elevation={2}
                    sx={{
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 2px 4px rgba(162, 228, 184, 0.1)'
                    }}
                >
                    <List disablePadding>
                        {achievements.map((achievement: Achievement, index: number) => (
                            <React.Fragment key={achievement.id}>
                                <ListItem 
                                    alignItems='flex-start'
                                    secondaryAction={
                                        <>
                                            <IconButton
                                                edge='end'
                                                aria-label='edit'
                                                onClick={() => handleEditClick(achievement)}
                                                sx={{ 
                                                    mr: 0.5,
                                                    color: '#A2E4B8',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(162, 228, 184, 0.1)',
                                                    }
                                                }}
                                                disabled={status === 'loading'}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge='end'
                                                aria-label='delete'
                                                onClick={() => handleDeleteClick(achievement.id)}
                                                sx={{
                                                    color: '#FF6B6B',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                                    }
                                                }}
                                                disabled={status === 'loading'}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant='subtitle1' component='span' fontWeight='bold' sx={{ color: '#4A4A4A' }}>
                                                {achievement.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component='span' variant='body2' color='text.primary' display='block' sx={{ color: '#4A4A4A' }}>
                                                    Date: {achievement.date}（Age: {formatAge(achievement.ageAtEvent)}）
                                                </Typography> 
                                                <Typography component='span' variant='body2' color='text.secondary' display='block' sx={{ whiteSpace: 'pre-wrap', mt: 0.5, color: '#757575' }}>
                                                    {achievement.description}
                                                </Typography>
                                                {achievement.tags && achievement.tags.length > 0 && (
                                                    <Box sx={{ mt: 1 }}>
                                                        {achievement.tags.map((tag: string) => (
                                                            <Chip 
                                                                key={tag} 
                                                                label={tag} 
                                                                size='small' 
                                                                sx={{ 
                                                                    mr: 0.5, 
                                                                    mb: 0.5,
                                                                    backgroundColor: '#C8F0D4',
                                                                    color: '#4A4A4A',
                                                                    '&:hover': {
                                                                        backgroundColor: '#A2E4B8',
                                                                    }
                                                                }} 
                                                            />
                                                        ))}
                                                    </Box>
                                                )}
                                                {achievement.photo && (
                                                    <Box
                                                        component="img"
                                                        src={achievement.photo}
                                                        alt={achievement.title}
                                                        sx={{
                                                            height: 233,
                                                            width: 350,
                                                            maxWidth: { xs: 150, md: 200 },
                                                            maxHeight: { xs: 250, md: 350 },
                                                            mt: 2,
                                                            borderRadius: '4px',
                                                        }}
                                                    />
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < achievements.length - 1 && (
                                    <Divider component='li' sx={{ borderColor: '#C8F0D4' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>

                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby='delete-dialog-title'
                    aria-describedby='delete-dialog-description'
                    PaperProps={{
                        sx: {
                            backgroundColor: '#F8F8F8',
                            border: '1px solid #C8F0D4'
                        }
                    }}
                >
                    <DialogTitle id='delete-dialog-title' sx={{ color: '#4A4A4A', fontWeight: 600 }}>
                        Delete Achievement
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id='delete-dialog-description' sx={{ color: '#4A4A4A' }}>
                            Do you want to delete this achievement? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleCloseDialog} 
                            sx={{
                                borderColor: '#A2E4B8',
                                color: '#A2E4B8',
                                '&:hover': {
                                    backgroundColor: 'rgba(162, 228, 184, 0.1)',
                                    borderColor: '#8BD4A0',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleConfirmDelete} 
                            sx={{
                                backgroundColor: '#FF6B6B',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#FF5252',
                                }
                            }}
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {editingAchievement && (
                    <EditAchievementModal
                        open={openEditModal}
                        onClose={handleCloseEditModal}
                        achievement={editingAchievement}
                        onSave={handleSaveEdit}
                    />
                )}
            </Box>
        )
    }   

    export default AchievementsList
