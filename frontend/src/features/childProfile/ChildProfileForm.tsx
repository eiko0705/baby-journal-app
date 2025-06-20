import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material"
import type { AppDispatch } from "../../app/store"
import { fetchProfile, updateProfile, selectProfile, selectProfileStatus, selectProfileError } from "./childProfileSlice"

const ChildProfileForm: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const profile = useSelector(selectProfile)
    const status = useSelector(selectProfileStatus)
    const error = useSelector(selectProfileError)
    
    const [localNickname, setLocalNickname] = useState<string>("")
    const [localGender, setLocalGender] = useState<string>("")
    const [localBirthday, setLocalBirthday] = useState<string>("")

    useEffect(() => {
        dispatch(fetchProfile())
    }, [dispatch])

    useEffect(() => {
        if (profile) {
            setLocalNickname(profile.nickname || "")
            setLocalGender(profile.gender || "")
            setLocalBirthday(profile.birthday || "")
        }
    }, [profile])

    const handleSaveProfile = () => {
        if (!localNickname.trim()) {
            alert("Please enter a nickname")
            return
        }
        if (!localGender) {
            alert("Please select a gender")
            return
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(localBirthday)) {
            alert("Please enter a valid date in the format YYYY-MM-DD")
            return
        }

        dispatch(updateProfile({
            nickname: localNickname.trim(),
            gender: localGender,
            birthday: localBirthday
        }))
    }

    return (
        <Box sx={{ 
            my: 2, 
            p: 2, 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            backgroundColor: 'background.paper'
        }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4A4A4A', fontWeight: 600 }}>
                Child Profile
            </Typography>
            
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    Error: {error}
                </Typography>
            )}

            <TextField
                label="Nickname"
                value={localNickname}
                onChange={(e) => setLocalNickname(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                disabled={status === 'loading'}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                    value={localGender}
                    label="Gender"
                    onChange={(e) => setLocalGender(e.target.value)}
                    disabled={status === 'loading'}
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Birthday (YYYY-MM-DD)"
                type="date"
                value={localBirthday}
                onChange={(e) => setLocalBirthday(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
                sx={{ mb: 2 }}
                disabled={status === 'loading'}
            />

            <Button 
                variant="contained" 
                onClick={handleSaveProfile}
                disabled={status === 'loading'}
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'text.primary',
                }}
            >
                {status === 'loading' ? <CircularProgress size={24} /> : 'Save Profile'}
            </Button>
        </Box>
    )
}

export default ChildProfileForm
