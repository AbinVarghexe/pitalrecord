export type UserRole = 'patient' | 'doctor' | 'admin'
export type KeyScope = 'read' | 'read_write'
export type AccessAction = 'key_used' | 'record_viewed' | 'rx_added' | 'key_revoked'

export interface User {
  id: string
  email: string
  role: UserRole
  mfa_enabled: boolean
  created_at: string
  deleted_at: string | null
  updated_at: string
}

export interface FamilyProfile {
  id: string
  user_id: string
  name: string
  dob: string
  blood_group: string | null
  allergies: string[] | null
  notes: string | null
  created_at: string
  deleted_at: string | null
  updated_at: string
}

export interface Prescription {
  id: string
  profile_id: string
  file_url: string
  visit_date: string | null
  hospital_name: string | null
  attending_doctor: string | null
  diagnosis: string[] | null
  raw_text: string | null
  ai_confidence: number | null
  created_at: string
  deleted_at: string | null
  updated_at: string
}

export interface Medicine {
  id: string
  prescription_id: string
  name: string
  dosage: string | null
  frequency: string | null
  duration: string | null
  instructions: string | null
  created_at: string
}

export interface DoctorAccessKey {
  id: string
  profile_id: string
  token_hash: string
  scope: KeyScope
  expires_at: string
  revoked: boolean
  revoked_at: string | null
  created_at: string
}

export interface AccessLog {
  id: string
  access_key_id: string
  action: AccessAction
  prescription_id: string | null
  ip_address: string
  user_agent: string | null
  timestamp: string
}

// Prescription with medicines joined
export interface PrescriptionWithMedicines extends Prescription {
  medicines: Medicine[]
}

// Profile with prescriptions count
export interface FamilyProfileWithCount extends FamilyProfile {
  prescriptions_count?: number
}

// Database types for Supabase client
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'created_at' | 'updated_at' | 'deleted_at'>
        Update: Partial<Omit<User, 'id'>>
      }
      family_profiles: {
        Row: FamilyProfile
        Insert: Omit<FamilyProfile, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
        Update: Partial<Omit<FamilyProfile, 'id' | 'user_id'>>
      }
      prescriptions: {
        Row: Prescription
        Insert: Omit<Prescription, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
        Update: Partial<Omit<Prescription, 'id' | 'profile_id'>>
      }
      medicines: {
        Row: Medicine
        Insert: Omit<Medicine, 'id' | 'created_at'>
        Update: Partial<Omit<Medicine, 'id' | 'prescription_id'>>
      }
      doctor_access_keys: {
        Row: DoctorAccessKey
        Insert: Omit<DoctorAccessKey, 'id' | 'created_at' | 'revoked_at'>
        Update: Partial<Pick<DoctorAccessKey, 'revoked' | 'revoked_at'>>
      }
      access_logs: {
        Row: AccessLog
        Insert: Omit<AccessLog, 'id' | 'timestamp'>
        Update: never
      }
    }
    Enums: {
      user_role: UserRole
      key_scope: KeyScope
      access_action: AccessAction
    }
  }
}
