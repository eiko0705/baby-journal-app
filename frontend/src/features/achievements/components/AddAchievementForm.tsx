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
            alert('The child\'s birthday is not set. Please set the birthday first.')
            return
        }

        if (!date || !title ) {
            alert('Date and title are required.')
            return
        }

        const calculatedAge: Age | null = calculateAgeAtEvent(childBirthday, date)
        if (!calculatedAge) {
            alert('The date format is incorrect or the event date is before the birthday. Please correct it.')
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
            alert(`Failed to add achievement or upload photo: ${error.message || 'An unknown error occurred.'}`)
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ 
                mt: 2, 
                p: 2, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                backgroundColor: 'background.paper'
            }}>
            <Typography variant="h6" gutterBottom>Add Achievement</Typography>
            <Grid 
                container 
                spacing={2} 
                sx={{ 
                    width: '100%', 
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box'
                }}
            >
                <Grid xs={12} md={6}>
                    <TextField
                        label="Date"
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
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        disabled={addStatus === 'loading'}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        label="Description"
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
                        label="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        fullWidth
                        helperText="Example: #first time, #favorite toy"
                        disabled={addStatus === 'loading'}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        component="label"
                        disabled={addStatus === 'loading'}
                        sx={{
                            backgroundColor: 'secondary.main',
                            color: 'primary.contrastText',
                        }}
                    >
                        Select Photo
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
                        sx={{
                            color: 'text.primary',
                        }}
                        disabled={addStatus === 'loading'}
                    >
                        {addStatus === 'loading' ? <CircularProgress size={24} /> : 'Add'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AddAchievementForm