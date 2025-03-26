import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Box, Typography, MenuItem, IconButton, InputAdornment, Alert, Snackbar, FormControl, InputLabel, Select, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, updateUserData} from '../apis/userApi'
import {  fetchTalentsByUserId } from '../apis/talentUserApi';
import {fetchTalentsByParent} from '../apis/talentApi';
import { Talent, TalentUser } from '../Types/Types';
import { validateEmail, validatePhoneNumber, validateAge } from '../utils/validation';
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

        // Fetch all talents and sub-talents
        const allTalents = await fetchAllTalentsWithSubTalents();

        // Ensure parent talents are selected if any sub-talents are selected
        const parentOfferedTalents = new Set<number>(offeredTalents);
        const parentWantedTalents = new Set<number>(wantedTalents);

        Object.keys(allTalents).forEach((parentId: string) => {
          const parentIntId = parseInt(parentId, 10);
          if (allTalents[parentIntId]?.some((subTalent: Talent) => offeredTalents.includes(subTalent.id))) {
            parentOfferedTalents.add(parentIntId);
          }
          if (allTalents[parentIntId]?.some((subTalent: Talent) => wantedTalents.includes(subTalent.id))) {
            parentWantedTalents.add(parentIntId);
          }
        });

        setFormData({
          username: userData.userName,
          email: userData.email,
          password: '',
          age: userData.age.toString(),
          gender: userData.gender === 0 ? 'Male' : 'Female',
          desc: userData.desc,
          profileImage: null,
          phoneNumber: userData.phoneNumber,
          offeredTalents: Array.from(parentOfferedTalents),
          wantedTalents: Array.from(parentWantedTalents),
        });
        setFileName(userData.profile);
        setExistingOfferedTalents(Array.from(parentOfferedTalents));
        setExistingWantedTalents(Array.from(parentWantedTalents));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('שגיאה בקבלת נתוני המשתמש');
      }
    };

    const fetchAllTalentsWithSubTalents = async () => {
      try {
        const response = await fetchTalentsByParent(0);
        setTalents(response);
        const allTalents: { [key: number]: Talent[] } = {};
        await Promise.all(response.map(async (talent: Talent) => {
          const subTalentsResponse = await fetchTalentsByParent(talent.id);
          allTalents[talent.id] = subTalentsResponse;
          setSubTalents(prevSubTalents => ({
            ...prevSubTalents,
            [talent.id]: subTalentsResponse,
          }));
        }));
        return allTalents;
      } catch (error) {
        console.error('Error fetching all talents:', error);
        return {};
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

  const parentTalentsMap: { [key: number]: number } = {};  // דוגמת מיפוי, יש לוודא שזה מאותחל כראוי

  // פונקציה שתסמן גם את ההורים אם תת-כישרון נבחר
  const ensureParentSelected = (selectedTalents: number[]): number[] => {
    const allSelected = new Set(selectedTalents);

    selectedTalents.forEach((talentId) => {
      const parent = parentTalentsMap[talentId]; // מפה שמכילה את ההורה של כל תת-כישרון
      if (parent) {
        allSelected.add(parent);
      }
    });

    return Array.from(allSelected);
  };

  const handleTalentChange = async (e: SelectChangeEvent<number[]>, type: 'offered' | 'wanted') => {
    const selectedTalents = e.target.value as number[];

    // Check if any parent talent is being deselected
    const deselectedParents = formData[type === 'offered' ? 'offeredTalents' : 'wantedTalents'].filter(talentId => !selectedTalents.includes(talentId));

    // Collect all sub-talents of the deselected parent talents
    const subTalentsToDeselect = deselectedParents.flatMap(parentId => {
      return subTalents[parentId]?.map(subTalent => subTalent.id) || [];
    });

    // Create the final list of selected talents, excluding sub-talents of deselected parents
    const finalSelectedTalents = selectedTalents.filter(talentId => !subTalentsToDeselect.includes(talentId));

    setFormData((prevData) => ({
      ...prevData,
      [type === 'offered' ? 'offeredTalents' : 'wantedTalents']: finalSelectedTalents,
    }));

    // Fetch sub-talents for the newly selected main talents
    for (const talentId of finalSelectedTalents) {
      if (!subTalents[talentId]) {
        try {
          const response = await fetchTalentsByParent(talentId);
          setSubTalents((prevSubTalents) => ({
            ...prevSubTalents,
            [talentId]: response,
          }));
        } catch (error) {
          console.error('Error fetching sub-talents:', error);
        }
      }
    }
  };


  // יצירת refs עבור כל אחד מהשדות בטופס
  const errorRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newFieldErrors = {
      username: !formData.username,
      email: !formData.email || !validateEmail(formData.email),
      password: !formData.password,
      age: !formData.age || !validateAge(formData.age),
      gender: !formData.gender,
      phoneNumber: !formData.phoneNumber || !validatePhoneNumber(formData.phoneNumber),
      desc: !formData.desc,
    };

    if (Object.values(newFieldErrors).some(error => error)) {
      setFieldErrors(newFieldErrors);
      setError('נא למלא את כל השדות החובה המסומנים באדום.');
      // גלילה לשדה הראשון שיש בו שגיאה
      if (newFieldErrors.username) {
        usernameRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.email) {
        emailRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.password) {
        passwordRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.age) {
        ageRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.gender) {
        genderRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.phoneNumber) {
        phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (newFieldErrors.desc) {
        descRef.current?.scrollIntoView({ behavior: 'smooth' });
      }

      return;
    }

    // בדיקה אם יש כשרון שנבחר גם ברשימת הכשרונות המוצעים וגם ברשימת הכשרונות הרצויים
    const commonTalents = formData.offeredTalents.filter(talentId => formData.wantedTalents.includes(talentId));

    const hasCommonParentTalentWithDifferentSubTalents = commonTalents.some(talentId => {
      const offeredSubTalents = subTalents[talentId]?.filter(subTalent => formData.offeredTalents.includes(subTalent.id)) || [];
      const wantedSubTalents = subTalents[talentId]?.filter(subTalent => formData.wantedTalents.includes(subTalent.id)) || [];

      const isParentTalentWithoutSubTalents = offeredSubTalents.length === 0 && wantedSubTalents.length === 0;

      // אם זה שני תתי כשרונות ואותו אב אך התתי כשרונות שונים זה כן טוב
      const hasDifferentSubTalents = offeredSubTalents.length > 0 && wantedSubTalents.length > 0 && !offeredSubTalents.every(subTalent => wantedSubTalents.includes(subTalent));

      return isParentTalentWithoutSubTalents || !hasDifferentSubTalents;
    });

    if (commonTalents.length > 0 && hasCommonParentTalentWithDifferentSubTalents) {
      setError('אין אפשרות לבחור את אותו כשרון גם ברשימת הכשרונות המוצעים וגם ברשימת הכשרונות הרצויים.');
      errorRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // סינון הכשרונות
    const filterTalents = (talentIds: number[], otherTalentIds: number[]) => {
      const filteredTalents: Set<number> = new Set();

      talentIds.forEach(talentId => {
        const subTalentIds = subTalents[talentId] || [];
        let hasSelectedSubTalent = false;

        subTalentIds.forEach(subTalent => {
          if (formData.offeredTalents.includes(subTalent.id) || formData.wantedTalents.includes(subTalent.id)) {
            filteredTalents.add(subTalent.id);
            hasSelectedSubTalent = true;
          }
        });

        // אם לא נבחרו תתי-כשרונות, נוסיף את כשרון האב
        if (!hasSelectedSubTalent) {
          filteredTalents.add(talentId);
        }
      });

      return Array.from(filteredTalents).filter(talentId => !otherTalentIds.includes(talentId));
    };

    const finalOfferedTalents = filterTalents(formData.offeredTalents, formData.wantedTalents);
    const finalWantedTalents = filterTalents(formData.wantedTalents, formData.offeredTalents);

    const talentsToSend = [
      ...finalOfferedTalents.map(talentId => ({ TalentId: talentId, IsOffered: true })),
      ...finalWantedTalents.map(talentId => ({ TalentId: talentId, IsOffered: false })),
    ];

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

  const isTalentChecked = (talentId: number, type: 'offered' | 'wanted') => {
    const selectedTalents = type === 'offered' ? formData.offeredTalents : formData.wantedTalents;

    // Check if the talent is selected directly or any of its sub-talents are selected
    const isChecked = selectedTalents.includes(talentId) ||
      talents.some(talent => talent.parentCategory === talentId && selectedTalents.includes(talent.id));

    return isChecked;
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
          inputRef={usernameRef}
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
          helperText={fieldErrors.email && 'נא למלא כתובת אימייל תקינה'}
          inputRef={emailRef}
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
          inputRef={passwordRef}
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
          helperText={fieldErrors.age && 'נא למלא גיל תקין'}
          inputRef={ageRef}
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
          inputRef={genderRef}
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
          inputRef={phoneNumberRef}
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
          inputRef={descRef}
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
                <Checkbox checked={isTalentChecked(talent.id, 'offered')} />
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
                <Checkbox checked={isTalentChecked(talent.id, 'wanted')} />
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