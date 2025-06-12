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
                    alert(`削除に失敗しました。${error instanceof Error ? error.message : '不明なエラーが発生しました。'}`)
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
                alert(`更新に失敗しました。${error instanceof Error ? error.message : '不明なエラーが発生しました。'}`)
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
                    エラー: {error}
                </Typography>
            )
        }

        if (achievements.length === 0 && status === 'succeeded') {
            return (
                <Typography color='text.secondary' sx={{ mt: 2, textAlign: 'center' }}>
                    まだ「できたこと」記録がありません。
                </Typography>
            )
        }

        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant='h6' gutterBottom>
                    「できたこと」の記録一覧
                </Typography>
                {status === 'loading' && <CircularProgress size={20} sx={{ display: 'block', margin: '0 auto' }} />}
                <Paper elevation={2}>
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
                                                sx={{ mr: 0.5 }}
                                                disabled={status === 'loading'}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge='end'
                                                aria-label='delete'
                                                onClick={() => handleDeleteClick(achievement.id)}
                                                disabled={status === 'loading'}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant='subtitle1' component='span' fontWeight='bold'>
                                                {achievement.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component='span' variant='body2' color='text.primary' display='block'>
                                                    日付: {achievement.date}（月齢: {formatAge(achievement.ageAtEvent)}）
                                                </Typography> 
                                                <Typography component='span' variant='body2' color='text.secondary' display='block' sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                                                    {achievement.description}
                                                </Typography>
                                                {achievement.tags && achievement.tags.length > 0 && (
                                                    <Box sx={{ mt: 1 }}>
                                                        {achievement.tags.map((tag: string) => (
                                                            <Chip key={tag} label={tag} size='small' sx={{ mr: 0.5, mb: 0.5 }} />
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
                                    <Divider component='li' />
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
                >
                    <DialogTitle id='delete-dialog-title'>
                        記録の削除
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id='delete-dialog-description'>
                            この「できたこと」の記録を本当に削除しますか？この操作は元に戻せません。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color='primary'>キャンセル</Button>
                        <Button onClick={handleConfirmDelete} color='error' autoFocus>削除する</Button>
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
