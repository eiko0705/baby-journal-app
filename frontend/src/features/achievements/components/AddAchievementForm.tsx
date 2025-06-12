import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, Box, Typography, Grid, CircularProgress } from '@mui/material'
import type { AppDispatch } from '../../../app/store'
import { addNewAchievement, selectAchievementsStatus, uploadPhoto } from '../achievementsSlice'
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null)
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0])
        }
    }

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
        }

        try {
            const addedAchievementAction = await dispatch(addNewAchievement(newAchievementPayload)).unwrap()
            const newAchievementId = addedAchievementAction.id

            if (selectedFile && newAchievementId) {
                await dispatch(uploadPhoto({ id: newAchievementId, photoFile: selectedFile })).unwrap()
            }

            setDate('')
            setTitle('')
            setDescription('')
            setTags('')
            setSelectedFile(null)
            setPreview(null)
        } catch (error: any) {
            console.error('Failed to add achievement or upload photo:', error)
            alert(`保存または写真のアップロードに失敗しました: ${error.message || '不明なエラーが発生しました。'}`)
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
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={addStatus === 'loading'}
                    >
                        写真を選択
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                            id="photo-upload"
                        />
                    </Button>
                    {selectedFile && (
                        <Typography variant="body2" sx={{ ml: 2, display: 'inline-block' }}>
                            {selectedFile.name}
                        </Typography>
                    )}
                </Grid>

                {preview && (
                    <Grid item xs={12}>
                        <Box component="img" src={preview} alt="Preview" sx={{ maxWidth: '100%', maxHeight: '200px', mt: 1 }} />
                    </Grid>
                )}
                
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