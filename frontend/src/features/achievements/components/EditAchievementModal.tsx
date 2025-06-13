import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, CircularProgress, Box, Typography } from '@mui/material'
import { format, parseISO, isValid } from 'date-fns'
import type { Achievement, NewAchievementPayload, Age } from '../../../types'
import { calculateAgeAtEvent, formatAge } from '../../../utils/dateUtils'
import { selectBirthday } from '../../childProfile/childProfileSlice'
import { selectAchievementsStatus } from '../achievementsSlice'

interface EditAchievementModalProps {
  open: boolean
  onClose: () => void
  achievement: Achievement | null
  onSave: (id: string, data: NewAchievementPayload) => Promise<void>
}

const EditAchievementModal: React.FC<EditAchievementModalProps> = ({ open, onClose, achievement, onSave }) => {
  const childBirthday = useSelector(selectBirthday)
  const achievementApiStatus = useSelector(selectAchievementsStatus)

  const [formDate, setFormDate] = useState<string>('')
  const [formTitle, setFormTitle] = useState<string>('')
  const [formDescription, setFormDescription] = useState<string>('')
  const [formTags, setFormTags] = useState<string>('')

  const [calculatedAge, setCalculatedAge] = useState<Age | null>(null);

  useEffect(() => {
    if (achievement) {
      if (achievement.date) {
        try {
          const parsedDate = parseISO(achievement.date)
          if (isValid(parsedDate)) {
            setFormDate(format(parsedDate, 'yyyy-MM-dd')) 
          } else {
            setFormDate('')
          }
        } catch (e) {
          setFormDate('')
        }
      } else { 
        setFormDate('')
      }
      setFormTitle(achievement.title)
      setFormDescription(achievement.description || '')
      setFormTags(achievement.tags ? achievement.tags.join(', ') : '')
      setCalculatedAge(achievement.ageAtEvent)
    } else {
      setFormDate('')
      setFormTitle('')
      setFormDescription('')
      setFormTags('')
      setCalculatedAge(null)
    }
  }, [achievement])

  const handleDateChange = (newDate: string) => {
    setFormDate(newDate); 

    if (newDate && childBirthday) {
      const newAge = calculateAgeAtEvent(childBirthday, newDate);
      setCalculatedAge(newAge);
    } else {
      setCalculatedAge(null);
    }
  };

  const handleSubmit = async () => {
    if (!achievement) return

    if (!childBirthday) {
      alert('Please set the child\'s birthday.')
      return
    }

    if (!formDate || !formTitle) {
      alert('Date and title are required.')
      return
    }

    if (!calculatedAge) {
      alert('Age cannot be calculated. Please check the date.')
      return
    }

    const updatedData: NewAchievementPayload = {
      date: formDate,
      title: formTitle,
      description: formDescription,
      ageAtEvent: calculatedAge,
      tags: formTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      photo: achievement.photo
    }

    await onSave(achievement.id, updatedData)
    return
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Edit Achievement</DialogTitle>
      <DialogContent>
        <Box component='form' noValidate sx={{ mt: 1}}>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Date'
              type='date'
              value={formDate}
              onChange={(e) => handleDateChange(e.target.value)}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              disabled={achievementApiStatus === 'loading'}
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Title'
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              fullWidth
              disabled={achievementApiStatus === 'loading'}
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant='caption'
              color='textSecondary'
              display='block'
              sx={{
                mt: 1,
                mb: 1
              }}
            >
              Age: {calculatedAge ? formatAge(calculatedAge) : 'Please enter the date.'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
              <TextField
                label="Description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                disabled={achievementApiStatus === 'loading'}
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Tags (comma separated)'
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              fullWidth
              helperText='Example: #first time, #favorite toy'
              disabled={achievementApiStatus === 'loading'}
            />
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={achievementApiStatus === 'loading'}
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
          onClick={handleSubmit}
          variant='contained'
          color='primary'
          disabled={achievementApiStatus === 'loading'}
        >
          {achievementApiStatus === 'loading' ? <CircularProgress size={24}/> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditAchievementModal