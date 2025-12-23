// import { useEffect, useState } from 'react';
// import { fetchTalentsByUserId,  updateUserData} from '../apis/talentUser';
// import { fetchTalentsByParent } from '../apis/talentApi';
// interface Talent {
//   id: number;
//   name: string;
//   parentId: number | null;
// }

// interface TalentUserDto {
//   userId: number;
//   talentId: number;
//   isOffered: boolean;
// }

// const UpdateTalentsForm = ({ userId }: { userId: number }) => {
//   const [allTalents, setAllTalents] = useState<Talent[]>([]); // All talents
//   const [selectedGive, setSelectedGive] = useState<number[]>([]); // Talents I offer
//   const [selectedRequest, setSelectedRequest] = useState<number[]>([]); // Talents I want
//   const [expanded, setExpanded] = useState<number[]>([]); // Parent items that are expanded

//   // Group talents by their parent
//   const [childTalents, setChildTalents] = useState<{ [key: number]: Talent[] }>({});

//   useEffect(() => {
//     const loadUserTalents = async () => {
//       try {
//         // Load all talents for display
//         const talents = await fetchTalentsByParent(0);
//         setAllTalents(talents);

//         // Load the user's talents from the DB
//         const userTalents: TalentUserDto[] = await fetchTalentsByUserId(userId);
//         console.log('talents from DB:', userTalents);

//         // Sort by IsOffered
//         const give = userTalents.filter(t => t.isOffered).map(t => t.talentId);
//         const request = userTalents.filter(t => !t.isOffered).map(t => t.talentId);

//         setSelectedGive(give);
//         setSelectedRequest(request);

//         // Load all child talents under each parent
//         const talentsByParent: { [key: number]: Talent[] } = {};
//         for (const talent of talents) {
//           if (talent.parentId !== null) {
//             if (!talentsByParent[talent.parentId]) {
//               talentsByParent[talent.parentId] = [];
//             }
//             talentsByParent[talent.parentId].push(talent);
//           }
//         }
//         setChildTalents(talentsByParent);

//       } catch (error) {
//         console.error('Error loading data:', error);
//       }
//     };

//     loadUserTalents();
//   }, [userId]);

//   const handleCheckboxChange = (
//     talentId: number,
//     type: 'give' | 'request'
//   ) => {
//     if (type === 'give') {
//       setSelectedGive(prev =>
//         prev.includes(talentId) ? prev.filter(id => id !== talentId) : [...prev, talentId]
//       );
//     } else {
//       setSelectedRequest(prev =>
//         prev.includes(talentId) ? prev.filter(id => id !== talentId) : [...prev, talentId]
//       );
//     }
//   };

//   const handleSave = async () => {
//     const talentsDto: TalentUserDto[] = [
//       ...selectedGive.map(talentId => ({
//         userId,
//         talentId,
//         isOffered: true,
//       })),
//       ...selectedRequest.map(talentId => ({
//         userId,
//         talentId,
//         isOffered: false,
//       })),
//     ];

//     console.log('Data to save:', talentsDto);

//     const formData = new FormData();
//     formData.append('talents', JSON.stringify(talentsDto));

//     try {
//       await updateUserData(userId, formData);
//       alert('Data saved successfully!');
//     } catch (err) {
//       console.error('Error saving data:', err);
//       alert('Error saving data');
//     }
//   };

//   const handleExpandClick = (parentId: number) => {
//     setExpanded(prev => 
//       prev.includes(parentId) ? prev.filter(id => id !== parentId) : [...prev, parentId]
//     );
//   };

//   return (
//     <div>
//       <h2>Talents I offer</h2>
//       {allTalents.map(talent => (
//         <div key={talent.id}>
//           <input
//             type="checkbox"
//             checked={selectedGive.includes(talent.id)}
//             onChange={() => handleCheckboxChange(talent.id, 'give')}
//           />
//           {talent.name}

//           {/* Button to expand children (if any) */}
//           {childTalents[talent.id] && (
//             <button onClick={() => handleExpandClick(talent.id)}>
//               {expanded.includes(talent.id) ? 'Close' : 'Show sub-talents'}
//             </button>
//           )}

//           {/* Display children when expanded */}
//           {expanded.includes(talent.id) && childTalents[talent.id]?.map(child => (
//             <div key={child.id} style={{ marginLeft: '20px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedGive.includes(child.id)}
//                 onChange={() => handleCheckboxChange(child.id, 'give')}
//               />
//               {child.name}
//             </div>
//           ))}
//         </div>
//       ))}

//       <h2>Talents I want</h2>
//       {allTalents.map(talent => (
//         <div key={talent.id}>
//           <input
//             type="checkbox"
//             checked={selectedRequest.includes(talent.id)}
//             onChange={() => handleCheckboxChange(talent.id, 'request')}
//           />
//           {talent.name}

//           {/* Button to expand children (if any) */}
//           {childTalents[talent.id] && (
//             <button onClick={() => handleExpandClick(talent.id)}>
//               {expanded.includes(talent.id) ? 'Close' : 'Show sub-talents'}
//             </button>
//           )}

//           {/* Display children when expanded */}
//           {expanded.includes(talent.id) && childTalents[talent.id]?.map(child => (
//             <div key={child.id} style={{ marginLeft: '20px' }}>
//               <input
//                 type="checkbox"
//                 checked={selectedRequest.includes(child.id)}
//                 onChange={() => handleCheckboxChange(child.id, 'request')}
//               />
//               {child.name}
//             </div>
//           ))}
//         </div>
//       ))}

//       <button onClick={handleSave}>Save</button>
//     </div>
//   );
// };

// export default UpdateTalentsForm;
export const hirtut = ()=> {console.log('end of snippet')}
