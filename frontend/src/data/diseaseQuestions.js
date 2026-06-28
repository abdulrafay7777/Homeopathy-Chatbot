/** Client-side disease list + follow-up MCQs (mirrors backend/disease_questions.py) */

const DISEASE_BANK = {
  headache: {
    label: 'Sar Dard (Headache)',
    questions: [
      { id: 'duration', question: 'Kitne arsay se sar dard ho raha hai?', options: ['Aaj se', '1-3 din', '1 hafte se', '1 mahine se zyada'] },
      { id: 'location', question: 'Sar ke kis hisse mein dard hai?', options: ['Pura sar', 'Forehead / Agla hissa', 'Peeche ki taraf', 'Ek taraf (left ya right)'] },
      { id: 'intensity', question: 'Dard ki intensity kya hai?', options: ['Halka', 'Darmiyana', 'Bohat shadeed'] },
      { id: 'triggers', question: 'Dard kab zyada hota hai?', options: ['Subah uthte hi', 'Din mein / kaam karte waqt', 'Raat ko', 'Roshni ya awaaz se'] },
    ],
  },
  fever: {
    label: 'Bukhar (Fever)',
    questions: [
      { id: 'duration', question: 'Kitne din se bukhar hai?', options: ['Aaj se', '1-2 din', '3-5 din', '5 din se zyada'] },
      { id: 'pattern', question: 'Bukhar ka pattern kya hai?', options: ['Lagatar', 'Subah kam, shaam zyada', 'Ruk ruk kar aata hai', 'Raat ko zyada'] },
      { id: 'temperature', question: 'Bukhar ki intensity?', options: ['Halka bukhar', 'Darmiyana', 'Bohat tez bukhar'] },
      { id: 'associated', question: 'Bukhar ke sath kya alamat hain?', options: ['Thand lagna', 'Pasina', 'Jism dard', 'Koi aur nahi'] },
    ],
  },
  cough: {
    label: 'Khansi (Cough)',
    questions: [
      { id: 'duration', question: 'Kitne arsay se khansi hai?', options: ['1-3 din', '1 hafte se', '2-4 hafte', '1 mahine se zyada'] },
      { id: 'type', question: 'Khansi kis qisam ki hai?', options: ['Sukhi khansi', 'Balgam wali', 'Tez / khoon wali', 'Raat ko zyada'] },
      { id: 'frequency', question: 'Khansi kitni baar aati hai?', options: ['Kabhi kabhi', 'Kai baar din mein', 'Lagatar', 'Neend mein bhi'] },
      { id: 'associated', question: 'Khansi ke sath kya hai?', options: ['Bukhar', 'Sar dard', 'Saans ki takleef', 'Koi aur nahi'] },
    ],
  },
  stomach: {
    label: 'Pet / Digestion',
    questions: [
      { id: 'duration', question: 'Kitne arsay se masla hai?', options: ['Aaj se', '1-3 din', '1 hafte se', '1 mahine se zyada'] },
      { id: 'type', question: 'Masle ki qisam kya hai?', options: ['Dard', 'Gas / acidity', 'Qabz', 'Dast / loose motion'] },
      { id: 'timing', question: 'Dard / masla kab hota hai?', options: ['Khana khane se pehle', 'Khana khane ke baad', 'Khali pet', 'Raat ko'] },
      { id: 'severity', question: 'Intensity kya hai?', options: ['Halka', 'Darmiyana', 'Bohat shadeed'] },
    ],
  },
  insomnia: {
    label: 'Neend / Sleep',
    questions: [
      { id: 'duration', question: 'Kitne arsay se neend ka masla hai?', options: ['Kuch din se', '1-2 hafte', '1 mahine se', 'Kai mahine se'] },
      { id: 'pattern', question: 'Neend ka masla kya hai?', options: ['Sone mein der lagti hai', 'Raat ko bar bar jag jata hoon', 'Subah jaldi uth jata hoon', 'Neend poori nahi hoti'] },
      { id: 'cause', question: 'Kya lagta hai wajah kya hai?', options: ['Tension / stress', 'Dard ya alamat', 'Koi wajah nahi', 'Pata nahi'] },
      { id: 'daytime', question: 'Din mein kaisa mehsoos hota hai?', options: ['Thakaan', 'Chidchida pan', 'Theek mehsoos', 'Sar dard'] },
    ],
  },
  skin: {
    label: 'Jild / Skin',
    questions: [
      { id: 'duration', question: 'Kitne arsay se masla hai?', options: ['Kuch din', '1-2 hafte', '1 mahine se', 'Mausam ke sath'] },
      { id: 'location', question: 'Jild ke kis hisse par?', options: ['Pura jism', 'Haath / paon', 'Chehra', 'Kisi ek jagah'] },
      { id: 'symptoms', question: 'Kya mehsoos hota hai?', options: ['Khujli', 'Jalan', 'Sukha pan', 'Daane / rash'] },
      { id: 'triggers', question: 'Kab zyada hota hai?', options: ['Raat ko', 'Garmi mein', 'Kisi cheez se contact', 'Pata nahi'] },
    ],
  },
};

export const COMMON_DISEASES = [
  ...Object.entries(DISEASE_BANK).map(([id, data]) => ({ id, label: data.label })),
  { id: 'other', label: 'Other — apni bemari likhen' },
];

export const getFollowUpByDiseaseId = (diseaseId) => {
  if (!diseaseId || diseaseId === 'other') return null;
  const data = DISEASE_BANK[diseaseId];
  if (!data) return null;
  return {
    diseaseId,
    disease: data.label,
    questions: data.questions,
  };
};
