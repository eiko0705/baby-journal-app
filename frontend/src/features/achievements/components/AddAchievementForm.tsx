import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, Box, Typography, Grid, CircularProgress } from '@mui/material'
import type { AppDispatch } from '../../../app/store'
import { addNewAchievement, selectAchievementsStatus } from '../achievementsSlice'
import { selectBirthday } from '../../childProfile/childProfileSlice'
import { calculateAgeAtEvent } from '../../../utils/dateUtils'
import type { NewAchievementPayload, Age } from '../../../types'

const AddAchievementForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const childBirthday = useSelector(selectBirthday)
    const addStatus = useSelector(selectAchievementsStatus)
    
    const [date, setDate] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [tags, setTags] = useState<string>('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!childBirthday) {
            alert('お子様の誕生日が設定されていません。先に誕生日を設定してください。')
            return
        }

        if (!date || !title ) {
            alert('日付とタイトルは必須です。')
            return
        }

        const calculatedAge: Age | null = calculateAgeAtEvent(childBirthday, date)
        if (!calculatedAge) {
            alert('日付の形式が正しくないか、イベント日が誕生日より前です。修正してください。')
            return
        }

        const newAchievementPayload: NewAchievementPayload = {
            date, 
            title, 
            description,
            ageAtEvent: calculatedAge,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            // photo: null
        }

        try {
            await dispatch(addNewAchievement(newAchievementPayload)).unwrap()
            setDate('')
            setTitle('')
            setDescription('')
            setTags('')
        } catch (error: any) {
            console.error('Failed to add achievement:', error)
            alert(`記録に失敗しました。: ${error.message || '不明なエラーが発生しました。'}`)
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2, p: 2, border: '1px solid lightgray', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>Add Achievement</Typography>
            <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                    <TextField
                        label="日付"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                        disabled={addStatus === 'loading'}
                    />
                </Grid>
                <Grid xs={12} md={6}>
                    <TextField
                        label="タイトル"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        disabled={addStatus === 'loading'}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        label="詳細"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        disabled={addStatus === 'loading'}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        label="タグ（カンマ区切りで入力）"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        fullWidth
                        helperText="例：　#初めてのハイハイ, #お気に入りのおもちゃ"
                        disabled={addStatus === 'loading'}
                    />
                </Grid>
                <Grid xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={addStatus === 'loading'}
                    >
                        {addStatus === 'loading' ? <CircularProgress size={24} /> : '記録する'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AddAchievementForm