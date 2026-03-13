export const DEMO_PROFILES = [
  {
    name: 'John Doe (Self)',
    dob: '1985-06-15',
    blood_group: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    notes: 'History of seasonal asthma.',
  },
  {
    name: 'Jane Doe (Spouse)',
    dob: '1988-09-22',
    blood_group: 'A-',
    allergies: [],
    notes: 'Regular blood donor.',
  },
  {
    name: 'Jimmy Doe (Child)',
    dob: '2018-03-10',
    blood_group: 'O+',
    allergies: ['Dust mites'],
    notes: 'All vaccinations up to date.',
  },
]

export const DEMO_PRESCRIPTIONS = [
  {
    profileName: 'John Doe (Self)',
    visit_date: '2026-01-15',
    hospital_name: 'City General Hospital',
    attending_doctor: 'Dr. Amitabh Sharma',
    diagnosis: ['Acute Bronchitis'],
    notes: 'Severe cough for 3 days',
    medicines: [
      {
        name: 'Azithromycin 500mg',
        dosage: '500mg',
        frequency: 'Once daily',
        duration: '3 days',
        instructions: 'Take before breakfast',
      },
      {
        name: 'Levocetirizine 5mg',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '5 days',
        instructions: 'Take at night',
      },
      {
        name: 'Dextromethorphan Syrup',
        dosage: '5ml',
        frequency: 'Three times a day',
        duration: '5 days',
        instructions: 'Take after food',
      },
    ],
  },
  {
    profileName: 'Jane Doe (Spouse)',
    visit_date: '2026-02-10',
    hospital_name: 'Apollo Clinic',
    attending_doctor: 'Dr. Priya Nair',
    diagnosis: ['Iron Deficiency Anemia'],
    notes: 'Following up on fatigue complaints',
    medicines: [
      {
        name: 'Ferrous Ascorbate 100mg',
        dosage: '100mg',
        frequency: 'Twice daily',
        duration: '30 days',
        instructions: 'Take after food',
      },
      {
        name: 'Vitamin C 500mg',
        dosage: '500mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with iron supplement',
      },
    ],
  },
  {
    profileName: 'Jimmy Doe (Child)',
    visit_date: '2026-03-01',
    hospital_name: "Rainbow Children's Hospital",
    attending_doctor: 'Dr. Sameer Gupta',
    diagnosis: ['Viral Fever'],
    notes: 'High fever for 24 hours',
    medicines: [
      {
        name: 'Paracetamol Syrup 250mg',
        dosage: '5ml',
        frequency: 'As needed',
        duration: '3 days',
        instructions: 'Max 4 times a day',
      },
      {
        name: 'Oral Rehydration Salts',
        dosage: '200ml',
        frequency: 'After each episode',
        duration: '2 days',
        instructions: 'Sip slowly',
      },
    ],
  },
]
