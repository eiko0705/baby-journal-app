import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { TextField, Button, Box, Typography } from "@mui/material"
import type { AppDispatch, RootState } from "../../app/store"
import { setBirthday, selectBirthday } from "./childProfileSlice"

const ChildBirthdayInput: React.FC = () => {
    const dispatch: AppDispatch = useDispatch()
    const storedBirthday = useSelector(selectBirthday)
    const [localBirthday, setLocalBirthday] = useState<string>(storedBirthday || "")

    useEffect(() => {
        setLocalBirthday(storedBirthday || "")
    }, [storedBirthday])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalBirthday(event.target.value)
    }

    const handleSaveBirthday = () => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(localBirthday)) {
            dispatch(setBirthday(localBirthday))
        } else {
            alert("Please enter a valid date in the format YYYY-MM-DD")
        }
    }

    return (
        <Box sx={{ 
            my: 2, 
            p: 2, 
            border: '1px solid #C8F0D4', 
            borderRadius: '8px',
            backgroundColor: '#F8F8F8'
        }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#4A4A4A', fontWeight: 600 }}>
                Child's Birthday
            </Typography>
            <TextField
                label="Birthday (YYYY-MM-DD)"
                type="date"
                value={localBirthday}
                onChange={handleInputChange}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button 
                variant="contained" 
                onClick={handleSaveBirthday}
                sx={{
                    backgroundColor: '#FFFFE0',
                    color: '#4A4A4A',
                    '&:hover': {
                        backgroundColor: '#FFFACD',
                    }
                }}
            >
                Save Birthday
            </Button>
        </Box>
    )
}

export default ChildBirthdayInput
