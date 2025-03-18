import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, IconButton, InputAdornment, Alert, Snackbar, FormControl, InputLabel, Select, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, updateUserData, fetchTalentsByParent, fetchTalentsByUserId } from '../api';
import { Talent, TalentUser } from '../Types/Types';
import '../styles/AuthForm.css';



const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'Female',
    desc: '',
    profileImage: null as File | null,
    phoneNumber: '',
    offeredTalents: [] as number[],
    wantedTalents: [] as number[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    email: false,
    password: false,
    age: false,
    gender: false,
    phoneNumber: false,
    desc: false,
  });
  const [userId, setUserId] = useState<number | null>(null);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [subTalents, setSubTalents] = useState<{ [key: number]: Talent[] }>({});
  const [existingOfferedTalents, setExistingOfferedTalents] = useState<number[]>([]);
  const [existingWantedTalents, setExistingWantedTalents] = useState<number[]>([]);
  const [talentsData, setTalentsData] = useState<TalentUser[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUserId(userData.id);
        const talentsData = await fetchTalentsByUserId(userData.id);
        const offeredTalents = talentsData.filter((talent: TalentUser) => talent.isOffered).map((talent: TalentUser) => talent.talentId);
        const wantedTalents = talentsData.filter((talent: TalentUser) => !talent.isOffered).map((talent: TalentUser) => talent.talentId);

        setFormData({
          username: userData.userName,
          email: userData.email,
          password: '',
          age: userData.age.toString(),
          gender: userData.gender === 0 ? 'Male' : 'Female',
          desc: userData.desc,
          profileImage: null,
          phoneNumber: userData.phoneNumber,
          offeredTalents: offeredTalents,
          wantedTalents: wantedTalents,
        });
        setFileName(userData.profile);
        setExistingOfferedTalents(offeredTalents);
        setExistingWantedTalents(wantedTalents);

        await fetchTalents(); // Fetch all talents
        await Promise.all([
          ...offeredTalents.map((talentId: number) => fetchSubTalents(talentId)),
          ...wantedTalents.map((talentId: number) => fetchSubTalents(talentId)),
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    const fetchTalents = async () => {
      try {
        const response = await fetchTalentsByParent(0);
        setTalents(response);
      } catch (error) {
        console.error('Error fetching talents:', error);
      }
    };

    const fetchSubTalents = async (talentId: number) => {
      const selectedTalent = talents.find(talent => talent.id === talentId);
      if (selectedTalent && selectedTalent.parentCategory === 0) {
        try {
          const response = await fetchTalentsByParent(talentId);
          setSubTalents(prevSubTalents => ({
            ...prevSubTalents,
            [talentId]: response,
          }));
        } catch (error) {
          console.error('Error fetching sub-talents:', error);
        }
      }
    };

    getUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: false,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
      setFileName(e.target.files[0].name);
    } else {
      setFormData({
        ...formData,
        profileImage: null,
      });
    }
  };

  const handleTalentChange = async (e: SelectChangeEvent<number[]>, type: 'offered' | 'wanted') => {
    const value = e.target.value as number[];

    setFormData({
      ...formData,
      [type === 'offered' ? 'offeredTalents' : 'wantedTalents']: value,
    });

    // Fetch sub-talents for the newly selected main talents
    for (const talentId of value) {
      if (!subTalents[talentId]) {
        try {
          const response = await fetchTalentsByParent(talentId);
          setSubTalents(prevSubTalents => ({
            ...prevSubTalents,
            [talentId]: response,
          }));
        } catch (error) {
          console.error('Error fetching sub-talents:', error);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFieldErrors = {
      username: !formData.username,
      email: !formData.email,
      password: false,
      age: !formData.age,
      gender: !formData.gender,
      phoneNumber: !formData.phoneNumber,
      desc: !formData.desc,
    };

    if (Object.values(newFieldErrors).some(error => error)) {
      setFieldErrors(newFieldErrors);
      setError('נא למלא את כל השדות החובה המסומנים באדום.');
      return;
    }

    setError(null);
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== null && key !== 'offeredTalents' && key !== 'wantedTalents') {
          if (key === 'password') {
            formDataToSend.append('hashPwd', value as string);
          } else {
            formDataToSend.append(key, value as string | Blob);
          }
        }
      });

      if (formData.profileImage && formData.profileImage.name !== 'default_profile_image.png') {
        formDataToSend.append('File', formData.profileImage);
      } else {
        formDataToSend.append('ProfileImage', 'null');
        formDataToSend.append('File', 'null');
      }

      const filterTalents = (talentIds: number[]) => {
        const filteredTalents: number[] = [];
        talentIds.forEach(talentId => {
          const subTalentIds = subTalents[talentId] || [];
          if (subTalentIds.length > 0) {
            subTalentIds.forEach(subTalent => {
              if (formData.offeredTalents.includes(subTalent.id) || formData.wantedTalents.includes(subTalent.id)) {
                filteredTalents.push(subTalent.id);
              }
            });
          } else {
            filteredTalents.push(talentId);
          }
        });
        return filteredTalents;
      };

      const finalOfferedTalents = filterTalents(formData.offeredTalents);
      const finalWantedTalents = filterTalents(formData.wantedTalents);

      const newOfferedTalents = finalOfferedTalents.filter(talentId =>
        !talentsData.some(talent => talent.talentId === talentId && talent.isOffered)
      );

      const newWantedTalents = finalWantedTalents.filter(talentId =>
        !talentsData.some(talent => talent.talentId === talentId && !talent.isOffered)
      );

      const removedOfferedTalents = talentsData.filter(talent =>
        talent.isOffered && !finalOfferedTalents.includes(talent.talentId)
      );

      const removedWantedTalents = talentsData.filter(talent =>
        !talent.isOffered && !finalWantedTalents.includes(talent.talentId)
      );

      const talentsToSend = [
        ...newOfferedTalents.map(talentId => ({ TalentId: talentId, IsOffered: true })),
        ...newWantedTalents.map(talentId => ({ TalentId: talentId, IsOffered: false })),
        ...removedOfferedTalents.map(talent => ({ TalentId: talent.talentId, IsOffered: true, Remove: true })),
        ...removedWantedTalents.map(talent => ({ TalentId: talent.talentId, IsOffered: false, Remove: true })),
      ];

      if (talentsToSend.length > 0) {
        formDataToSend.append('talents', JSON.stringify(talentsToSend));
      } else {
        formDataToSend.append('talents', JSON.stringify([]));
      }

      const response = await updateUserData(userId!, formDataToSend);

      console.log('Update successful:', response);
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Update failed:', error);
      setError(error.message || 'העדכון נכשל');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate className="auth-form-update">
      <Typography variant="h6" className="form-title">עדכון פרופיל</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
          <Alert severity="success">הפרופיל התעדכן בהצלחה</Alert>
        </Snackbar>
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="שם משתמש"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          error={fieldErrors.username}
          helperText={fieldErrors.username && 'נא למלא שם משתמש'}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="כתובת אימייל"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          helperText={fieldErrors.email && 'נא למלא כתובת אימייל'}
        />
        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="סיסמא"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          helperText={fieldErrors.password && 'נא למלא סיסמא'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="age"
          label="גיל"
          type="number"
          id="age"
          value={formData.age}
          onChange={handleChange}
          error={fieldErrors.age}
          helperText={fieldErrors.age && 'נא למלא גיל'}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="gender"
          label="מין"
          select
          value={formData.gender}
          onChange={handleChange}
          error={fieldErrors.gender}
          helperText={fieldErrors.gender && 'נא לבחור מין'}
        >
          <MenuItem value="Male">זכר</MenuItem>
          <MenuItem value="Female">נקבה</MenuItem>
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          name="phoneNumber"
          label="מספר טלפון"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={fieldErrors.phoneNumber}
          helperText={fieldErrors.phoneNumber && 'נא למלא מספר טלפון'}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="desc"
          label="תיאור"
          multiline
          rows={4}
          value={formData.desc}
          onChange={handleChange}
          error={fieldErrors.desc}
          helperText={fieldErrors.desc && 'נא למלא תיאור'}
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel id="offered-talents-label">כישורים מוצעים</InputLabel>
          <Select
            labelId="offered-talents-label"
            multiple
            value={formData.offeredTalents}
            onChange={(e) => handleTalentChange(e, 'offered')}
            renderValue={(selected) => selected.map((id) => talents.find((talent) => talent.id === id)?.talentName || '').join(', ')}
          >
            {talents.map((talent) => (
              <MenuItem key={talent.id} value={talent.id}>
                <Checkbox checked={formData.offeredTalents.indexOf(talent.id) > -1} />
                <ListItemText primary={talent.talentName || 'כישרון ללא שם'} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {formData.offeredTalents.map(talentId => (
          (subTalents[talentId] && subTalents[talentId].length > 0) && (
            <FormControl key={talentId} margin="normal" fullWidth>
              <InputLabel id={`sub-talents-label-${talentId}`}>תתי כישורים מוצעים ל-{talents.find(talent => talent.id === talentId)?.talentName}</InputLabel>
              <Select
                labelId={`sub-talents-label-${talentId}`}
                multiple
                value={formData.offeredTalents}
                onChange={(e) => handleTalentChange(e, 'offered')}
                renderValue={(selected: any) => subTalents[talentId].filter(talent => selected.includes(talent.id)).map(talent => talent.talentName).join(', ')}
              >
                {subTalents[talentId].map((subTalent) => (
                  <MenuItem key={subTalent.id} value={subTalent.id}>
                    <Checkbox checked={formData.offeredTalents.includes(subTalent.id)} />
                    <ListItemText primary={subTalent.talentName || 'כישרון ללא שם'} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        ))}
        <FormControl margin="normal" fullWidth>
          <InputLabel id="wanted-talents-label">כישורים רצויים</InputLabel>
          <Select
            labelId="wanted-talents-label"
            multiple
            value={formData.wantedTalents}
            onChange={(e) => handleTalentChange(e, 'wanted')}
            renderValue={(selected) => selected.map((id) => talents.find((talent) => talent.id === id)?.talentName || '').join(', ')}
          >
            {talents.map((talent) => (
              <MenuItem key={talent.id} value={talent.id}>
                <Checkbox checked={formData.wantedTalents.indexOf(talent.id) > -1} />
                <ListItemText primary={talent.talentName || 'כישרון ללא שם'} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {formData.wantedTalents.map(talentId => (
          (subTalents[talentId] && subTalents[talentId].length > 0) && (
            <FormControl key={talentId} margin="normal" fullWidth>
              <InputLabel id={`sub-talents-label-${talentId}`}>תתי כישורים רצויים ל-{talents.find(talent => talent.id === talentId)?.talentName}</InputLabel>
              <Select
                labelId={`sub-talents-label-${talentId}`}
                multiple
                value={formData.wantedTalents}
                onChange={(e) => handleTalentChange(e, 'wanted')}
                renderValue={(selected: any) => subTalents[talentId].filter(talent => selected.includes(talent.id)).map(talent => talent.talentName).join(', ')}
              >
                {subTalents[talentId].map((subTalent) => (
                  <MenuItem key={subTalent.id} value={subTalent.id}>
                    <Checkbox checked={formData.wantedTalents.includes(subTalent.id)} />
                    <ListItemText primary={subTalent.talentName || 'כישרון ללא שם'} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        ))}
        <Button variant="contained" component="label" fullWidth className="upload-btn">
          העלאת תמונת פרופיל
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {fileName && (
          <Box sx={{ mt: 1, p: 1, border: '1px dashed grey', borderRadius: '4px' }}>
            {fileName}
          </Box>
        )}
        <Button type="submit" fullWidth variant="contained" className="submit-btn">
          עדכון פרופיל
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProfile;