import React, { useState, useEffect } from "react";

interface Talent {
  id: number;
  talentName: string;
  parentCategory: number;
  parentTalentId?: number; // זהו אם הטאלנט שייך לקטגוריה (אב)
}

interface UserData {
  userName: string;
  email: string;
  password: string;
  talents: string[];
}

const SignUp = () => {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
    password: "",
    talents: []
  });

  // נתונים סטטיים של כישרונות
  useEffect(() => {
    setTalents([
      // כישרונות אב
      { id: 1, talentName: "נגינה בכינור", parentCategory: 0 },
      { id: 2, talentName: "ציור", parentCategory: 0 },
      { id: 3, talentName: "פיתוח תוכנה", parentCategory: 0 },
      // כישרונות בנים (שייכים לקטגוריות אב)
      { id: 4, talentName: "נגינה בכינור - קלאסי", parentCategory: 1, parentTalentId: 1 },
      { id: 5, talentName: "נגינה בכינור - מודרני", parentCategory: 1, parentTalentId: 1 },
      { id: 6, talentName: "ציור - אקריליק", parentCategory: 2, parentTalentId: 2 },
      { id: 7, talentName: "ציור - שמן", parentCategory: 2, parentTalentId: 2 }
    ]);
  }, []);

  // טיפול בשינוי במצב של כישרון נבחר
  const handleTalentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setUserData((prevState) => {
      const talents = checked
        ? [...prevState.talents, value]
        : prevState.talents.filter((talent) => talent !== value);

      return { ...prevState, talents };
    });
  };

  // שליחת הטופס
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // שלח את הנתונים לשרת
    console.log(userData);
  };

  return (
    <div className="signup-container">
      <h1>הרשמה</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם משתמש:</label>
          <input
            type="text"
            value={userData.userName}
            onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
            required
          />
        </div>

        <div>
          <label>אימייל:</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label>סיסמה:</label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
          />
        </div>

        <div className="talent-options">
          <h3>בחר את הכישרונות שלך:</h3>
          {talents.map((talent) => (
            <div key={talent.id}>
              <input
                type="checkbox"
                value={talent.talentName}
                onChange={handleTalentChange}
                id={`talent-${talent.id}`}
              />
              <label htmlFor={`talent-${talent.id}`}>{talent.talentName}</label>
            </div>
          ))}
        </div>

        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
};

export default SignUp;
