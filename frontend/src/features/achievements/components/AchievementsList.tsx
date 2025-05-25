    import React, { useEffect } from 'react'
    import { useSelector, useDispatch } from 'react-redux'
    import { Box, Typography, List, ListItem, ListItemText, Chip, Divider, Paper, CircularProgress } from '@mui/material'
    import { fetchAchievements, selectAllAchievements, selectAchievementsStatus, selectAchievementsError } from '../achievementsSlice'
    import type { Achievement, Age } from '../../../types'
    import type { AppDispatch } from '../../../app/store'

    const formatAge = (age: Age | null): string => {
        if (!age) return '月齢未計算'
        return `${age.years}歳${age.months}ヶ月${age.days}日`
    }

    const AchievementsList: React.FC = () => {
        const achievements = useSelector(selectAllAchievements)
        const dispatch: AppDispatch = useDispatch()
        const status = useSelector(selectAchievementsStatus)
        const error = useSelector(selectAchievementsError)

        useEffect(() => {
            if (status === 'idle') {
                dispatch(fetchAchievements())
            }
        }, [status, dispatch])

        if (status === 'loading') {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                </Box>
            )
        }

        if (status === 'failed') {
            return (
                <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                    エラー: {error}
                </Typography>
            )
        }

        if (achievements.length === 0 && status === 'succeeded') {
            return (
                <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    まだ「できたこと」記録がありません。
                </Typography>
            )
        }
        
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    「できたこと」の記録一覧
                </Typography>
                <Paper elevation={2}>
                    <List disablePadding>
                        {achievements.map((achievement: Achievement, index: number) => (
                            <React.Fragment key={achievement.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                                {achievement.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary" display="block">
                                                    日付: {achievement.date}（月齢: {formatAge(achievement.ageAtEvent)}）
                                                </Typography> 
                                                <Typography component="span" variant="body2" color="text.secondary" display="block" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                                                    {achievement.description}
                                                </Typography>
                                                {achievement.tags && achievement.tags.length > 0 && (
                                                    <Box sx={{ mt: 1 }}>
                                                        {achievement.tags.map((tag: string) => (
                                                            <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                                        ))}
                                                    </Box>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < achievements.length - 1 && (
                                    <Divider component="li" />
                                )}
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            </Box>
        )
    }   

    export default AchievementsList
