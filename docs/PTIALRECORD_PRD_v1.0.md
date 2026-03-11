# PTIALRECORD
## Patient Intelligence & Access Record System

**Product Requirements Document — Full Production Release**
Target: Private Hospitals & Clinics · Version 1.0 · Confidential

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [User Roles & Permissions](#5-user-roles--permissions)
6. [Feature Specifications](#6-feature-specifications)
7. [API Specification](#7-api-specification)
8. [Database Schema](#8-database-schema)
9. [Technical Architecture](#9-technical-architecture)
10. [Security & Compliance](#10-security--compliance)
11. [Production Deployment Plan](#11-production-deployment-plan)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Future Enhancements](#14-future-enhancements)
15. [Appendix](#15-appendix)

---

## 1. Executive Summary

PTIALRECORD (Patient Intelligence & Access Record) is a production-grade, secure web platform built exclusively for private hospitals and clinics. It digitises patient prescriptions, extracts structured medical data using AI/OCR, and provides fine-grained, time-limited access control so that only authorised clinicians can view a patient's history — with the patient in full control at all times.

| Attribute | Detail |
|---|---|
| Product Name | PTIALRECORD |
| Product Version | 1.0 — Full Production |
| Target Segment | Private Hospitals & Clinics |
| Primary Users | Patients, Families, Doctors, Clinic Admins |
| Deployment Model | Cloud-hosted SaaS (multi-tenant) |
| Regulatory Focus | Data Privacy, Encrypted Storage, Consent Logs |
| Release Type | Full Production (all MVP + post-MVP features) |

---

## 2. Problem Statement

### 2.1 Patient-Side Challenges

- Loss of physical prescriptions between consultations
- Inability to accurately recall medicine names, dosages, or treatment durations
- Fragmented records when visiting multiple clinics within a hospital network
- Difficulty managing elderly family members' complex medication histories
- No single source of truth for ongoing chronic disease management

### 2.2 Clinician-Side Challenges

- No accessible history at the point of consultation — solely reliant on patient recall
- Delays during initial assessments due to missing prior investigations
- Risk of duplicate prescriptions or adverse drug interactions
- Inability to quickly review previous diagnoses from other departments

### 2.3 Systemic Challenges

- Paper-based prescriptions are fragile and non-searchable
- No standardised interoperability between departments or associated clinics
- Audit gaps — no reliable log of who accessed what patient data and when

---

## 3. Goals & Success Metrics

### 3.1 Primary Goals

1. Digitise and preserve 100% of medical prescriptions uploaded by patients
2. Extract structured medical data with >90% accuracy using AI/OCR pipelines
3. Guarantee full patient ownership and consent control over all data
4. Enable temporary, scope-limited, audited doctor access without persistent data leakage
5. Provide a seamless, mobile-friendly experience for elderly users

### 3.2 Key Performance Indicators

| KPI | Target | Measurement Method |
|---|---|---|
| AI extraction accuracy | > 90% | Manual audit sample (monthly) |
| Prescription processing time | < 5 seconds | API response time (p95) |
| Unauthorised access incidents | 0 | Security audit logs |
| Session expiry compliance | 100% | Automated token TTL tests |
| User satisfaction (CSAT) | > 4.2 / 5 | In-app survey |
| System uptime | > 99.9% | Uptime monitoring (monthly) |
| Data loss incidents | 0 | Backup verification |

---

## 4. Target Users & Personas

| Persona | Description | Key Pain Points | Core Needs |
|---|---|---|---|
| Self-managing Patient (25–45) | Urban professional managing personal health records | Lost prescriptions, multiple clinics | Fast upload, easy search |
| Family Manager (35–55) | Caretaker for elderly parents or children | Tracking multiple family members | Multi-profile, reminders |
| Elderly Patient (60+) | Low digital literacy, assisted usage | Complex medication regimes | Simple UI, large text, guided flow |
| Consulting Doctor | Specialist or GP in private clinic | No prior history access, time pressure | Instant read access during consult |
| Clinic Administrator | Manages user accounts and access policies | Compliance, audit requirements | Audit logs, role management |

---

## 5. User Roles & Permissions

| Permission | Patient | Doctor | Clinic Admin | System |
|---|---|---|---|---|
| Create / manage family profiles | ✓ | — | — | — |
| Upload prescriptions | ✓ | — | — | — |
| View own medical history | ✓ | Session only | — | — |
| Edit prescription data | ✓ | If granted | — | — |
| Generate doctor access key | ✓ | — | — | — |
| Revoke doctor access | ✓ | — | ✓ | — |
| View access audit logs | ✓ | — | ✓ | — |
| Manage user accounts | — | — | ✓ | — |
| OCR / AI processing | — | — | — | ✓ |
| Session expiry enforcement | — | — | — | ✓ |

---

## 6. Feature Specifications

### 6.1 Authentication & Identity

| Feature | Details |
|---|---|
| Registration | Email + password with email verification link |
| Login | JWT access token (15 min TTL) + refresh token (7 days) |
| MFA | TOTP-based (Google Authenticator / Authy) — optional per user |
| Password Policy | Min 8 chars, 1 uppercase, 1 digit, 1 symbol |
| Session Management | Auto logout on inactivity > 30 min |
| Role Assignment | Patient (default), Doctor (verified), Clinic Admin (manual) |

### 6.2 Family Profile Management

- Primary account holder can create up to 10 family sub-profiles
- Each profile stores: Name, DOB, Blood Group, Allergies, Chronic Conditions, Address
- Profile-level privacy: each profile has an independent permission layer
- Soft delete with 30-day retention before permanent removal

### 6.3 Prescription Upload & Storage

| Aspect | Specification |
|---|---|
| Supported Formats | JPEG, PNG, HEIC, PDF (multi-page) |
| Max File Size | 20 MB per upload |
| Storage | AWS S3 / MinIO with server-side AES-256 encryption |
| Categorisation | Auto-tagged by upload date; manual override available |
| Retention | Indefinite unless patient deletes; 30-day soft delete |
| Versioning | Each edit creates a new version; original preserved |

### 6.4 AI-Based Prescription Intelligence

The AI pipeline processes uploaded documents through the following sequential stages:

| Stage | Process | Output |
|---|---|---|
| 1. Pre-processing | Image enhancement, deskew, contrast normalisation | Clean image |
| 2. OCR | Tesseract / Cloud Vision text extraction | Raw text string |
| 3. NER | LLM-based Named Entity Recognition | Structured JSON |
| 4. Validation | Rule-based checks on dosage, frequency, dates | Validated JSON |
| 5. Review | User reviews extracted data before final save | Confirmed record |

**Extracted entities include:** Hospital Name, Visit Date, Attending Doctor, Diagnosis, Medicines (name, dosage, frequency, duration), Instructions, Follow-up Date.

### 6.5 Doctor Temporary Access System

- Patient generates a cryptographically secure access key (UUID v4 + HMAC signature)
- Key TTL is configurable: 30 min, 1 hour, or 2 hours
- Scopes: Read-only or Read+Write (patient selects at generation time)
- Doctor enters key via a dedicated access portal — no account required
- Patient can revoke key at any time; revocation takes effect within 5 seconds
- All access events are logged: `key_used`, `records_viewed`, `prescription_added`, `key_revoked`
- No data can be downloaded or exported by the doctor during session

### 6.6 Medical Timeline & Search

- Chronological timeline view grouped by year and month
- Filter by: date range, hospital, doctor, condition/diagnosis
- Full-text search across medicine names, diagnosis, instructions
- Export timeline as PDF (patient only)
- Shareable read-only timeline link with expiry (for second opinions)

### 6.7 Notifications & Reminders

- Medicine course reminder: configurable push/email/SMS per medicine
- Follow-up appointment alerts: extracted from prescription, editable by patient
- Doctor access granted/revoked: real-time push notification
- New prescription uploaded: confirmation notification

### 6.8 Clinic Admin Portal

- Manage clinic-wide user accounts and role assignments
- View aggregated (anonymised) prescription volume metrics
- Configure clinic-specific access key policies (max TTL, default scope)
- Receive automated compliance reports (weekly CSV export)
- Incident alerts: failed login spikes, unusual access patterns

---

## 7. API Specification

### 7.1 Authentication Service

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | None | Create new patient account |
| `POST` | `/auth/login` | None | Returns access + refresh token |
| `POST` | `/auth/refresh` | Refresh token | Rotate access token |
| `POST` | `/auth/logout` | Access token | Invalidate session |
| `POST` | `/auth/mfa/enable` | Access token | Enable TOTP MFA |
| `POST` | `/auth/mfa/verify` | Access token | Verify TOTP code |

### 7.2 Profile Service

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/profiles` | Patient | Create family profile |
| `GET` | `/profiles` | Patient | List all profiles for account |
| `GET` | `/profiles/:id` | Patient | Get profile details |
| `PUT` | `/profiles/:id` | Patient | Update profile |
| `DELETE` | `/profiles/:id` | Patient | Soft delete profile |

### 7.3 Prescription Service

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/prescriptions/upload` | Patient | Upload image/PDF, trigger AI pipeline |
| `GET` | `/prescriptions/:profileId` | Patient / Doctor* | List prescriptions for profile |
| `GET` | `/prescriptions/:id` | Patient / Doctor* | Get single prescription detail |
| `PUT` | `/prescriptions/:id` | Patient / Doctor (write) | Edit structured data |
| `DELETE` | `/prescriptions/:id` | Patient | Soft delete prescription |
| `GET` | `/prescriptions/:id/versions` | Patient | List edit history |

> \* Doctor access is valid only within an active, non-revoked session.

### 7.4 Doctor Access Service

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/access/generate` | Patient | Generate access key with scope + TTL |
| `POST` | `/access/validate` | Doctor (key) | Validate key and return session token |
| `POST` | `/access/revoke` | Patient | Revoke active key immediately |
| `GET` | `/access/logs` | Patient / Admin | Get full access audit log |
| `GET` | `/access/active` | Patient | List currently active keys |

### 7.5 Timeline & Search

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/timeline/:profileId` | Patient / Doctor* | Chronological prescription timeline |
| `GET` | `/search?query=&profileId=` | Patient / Doctor* | Full-text search across records |
| `POST` | `/timeline/:profileId/export` | Patient | Generate PDF export |
| `POST` | `/timeline/:profileId/share` | Patient | Create shareable read-only link |

---

## 8. Database Schema

### 8.1 Overview

PostgreSQL is the primary store. Prisma ORM manages schema migrations. All foreign keys are indexed. Soft deletes use `deleted_at` timestamps.

### 8.2 Users

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | v4 UUID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Lowercased on write |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt, cost 12 |
| `role` | ENUM | NOT NULL | `patient \| doctor \| admin` |
| `mfa_secret` | VARCHAR(64) | NULLABLE | TOTP secret (encrypted) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Default: NOW() |
| `deleted_at` | TIMESTAMPTZ | NULLABLE | Soft delete |

### 8.3 FamilyProfiles

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | FK → Users.id | Cascade delete |
| `name` | VARCHAR(120) | NOT NULL | |
| `dob` | DATE | NOT NULL | |
| `blood_group` | VARCHAR(8) | NULLABLE | e.g. A+, O- |
| `allergies` | TEXT[] | NULLABLE | Array of allergy strings |
| `notes` | TEXT | NULLABLE | Free-form medical notes |
| `created_at` | TIMESTAMPTZ | NOT NULL | |
| `deleted_at` | TIMESTAMPTZ | NULLABLE | |

### 8.4 Prescriptions

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `profile_id` | UUID | FK → FamilyProfiles.id | |
| `file_url` | TEXT | NOT NULL | S3 / MinIO path (encrypted) |
| `visit_date` | DATE | NULLABLE | Extracted by AI |
| `hospital_name` | VARCHAR(255) | NULLABLE | |
| `attending_doctor` | VARCHAR(120) | NULLABLE | |
| `diagnosis` | TEXT[] | NULLABLE | Array of diagnoses |
| `raw_text` | TEXT | NULLABLE | Full OCR output |
| `ai_confidence` | NUMERIC(4,3) | NULLABLE | 0.000 – 1.000 |
| `created_at` | TIMESTAMPTZ | NOT NULL | |
| `deleted_at` | TIMESTAMPTZ | NULLABLE | |

### 8.5 Medicines

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `prescription_id` | UUID | FK → Prescriptions.id | |
| `name` | VARCHAR(255) | NOT NULL | Generic or brand name |
| `dosage` | VARCHAR(80) | NULLABLE | e.g. 500 mg |
| `frequency` | VARCHAR(80) | NULLABLE | e.g. Twice daily |
| `duration` | VARCHAR(80) | NULLABLE | e.g. 5 days |
| `instructions` | TEXT | NULLABLE | e.g. Take after food |

### 8.6 DoctorAccessKeys

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `profile_id` | UUID | FK → FamilyProfiles.id | |
| `token_hash` | VARCHAR(255) | UNIQUE, NOT NULL | SHA-256 of raw key |
| `scope` | ENUM | NOT NULL | `read \| read_write` |
| `expires_at` | TIMESTAMPTZ | NOT NULL | |
| `revoked` | BOOLEAN | DEFAULT false | |
| `revoked_at` | TIMESTAMPTZ | NULLABLE | |
| `created_at` | TIMESTAMPTZ | NOT NULL | |

### 8.7 AccessLogs

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `access_key_id` | UUID | FK → DoctorAccessKeys.id | |
| `action` | ENUM | NOT NULL | `key_used \| record_viewed \| rx_added \| key_revoked` |
| `prescription_id` | UUID | NULLABLE | If action = `record_viewed` |
| `ip_address` | INET | NOT NULL | |
| `user_agent` | TEXT | NULLABLE | |
| `timestamp` | TIMESTAMPTZ | NOT NULL | DEFAULT: NOW() |

---

## 9. Technical Architecture

### 9.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind CSS | Fast SPA, tree-shakeable, small bundle |
| Backend (API) | Node.js LTS + Express.js | Mature, async-first, large ecosystem |
| Authentication | JWT (access 15 min) + Refresh Token (7 days) | Stateless, scalable |
| ORM / Migrations | Prisma + TypeScript | Type-safe queries, auto-migrations |
| Database | PostgreSQL 16 | ACID, full-text search, JSONB support |
| File Storage | AWS S3 (prod) / MinIO (dev/staging) | Scalable object store, S3 API compatible |
| AI / OCR | Tesseract + GPT-4o (medical NER) | High accuracy, LLM structured output |
| Queue | Bull (Redis-backed) | Async AI pipeline, retry logic |
| Cache | Redis 7 | Session data, rate limiting, queue backend |
| Containerisation | Docker + Docker Compose | Reproducible environments |
| Orchestration | AWS ECS Fargate / Kubernetes | Auto-scaling, zero-downtime deploys |
| CI/CD | GitHub Actions | Lint → test → build → deploy pipeline |
| Monitoring | Prometheus + Grafana + Sentry | Metrics, error tracking, alerting |

### 9.2 Service Architecture

The backend is decomposed into six independently deployable microservices, each with its own database namespace. Communication between services is via REST over an internal VPC; the public API gateway handles auth, rate limiting, and routing.

| Service | Responsibility | External Deps |
|---|---|---|
| Auth Service | Registration, login, token issuance, MFA | Redis (session), PostgreSQL |
| Profile Service | Family profile CRUD, data validation | PostgreSQL |
| Medical Service | Prescriptions, medicines, timeline, search | PostgreSQL, S3/MinIO |
| AI Service | OCR processing, NER extraction, validation queue | Bull/Redis, OCR engine, OpenAI |
| Access Service | Key generation, validation, revocation, audit logs | PostgreSQL, Redis |
| Notification Service | Email, push, SMS dispatch | SendGrid, FCM, Twilio |

---

## 10. Security & Compliance

| Control | Implementation | Standard |
|---|---|---|
| Encryption at rest | AES-256 for all stored files; encrypted DB columns for sensitive fields | NIST SP 800-111 |
| Encryption in transit | TLS 1.3 enforced; HSTS header (max-age: 1 year) | NIST SP 800-52 |
| Token security | Access tokens: RS256 signed JWTs; stored in httpOnly cookies | OWASP |
| Access key hashing | SHA-256 with salt stored; raw key never persisted | OWASP |
| Rate limiting | 100 req/min per IP; 10 login attempts before 15-min lockout | OWASP ASVS |
| Input validation | Zod schema validation on all request bodies | OWASP |
| Dependency scanning | Dependabot + npm audit on every PR | CIS Controls |
| Penetration testing | Annual third-party pentest; quarterly internal scans | ISO 27001 |
| Data deletion | Patient can delete all data; permanent within 30 days | GDPR Art. 17 |
| Audit logging | Immutable append-only log for all data access events | ISO 27001 |

---

## 11. Production Deployment Plan

### 11.1 Phase Gate Overview

| Phase | Name | Duration | Exit Criteria |
|---|---|---|---|
| P0 | Infrastructure Setup | 2 weeks | All cloud resources provisioned, CI/CD live |
| P1 | Alpha Build | 6 weeks | Core CRUD + Auth functional, passing unit tests |
| P2 | Beta Build | 4 weeks | AI pipeline integrated, 80% feature coverage |
| P3 | Internal QA | 3 weeks | Zero P0/P1 bugs, security audit passed |
| P4 | Pilot Clinic Launch | 4 weeks | 50 pilot users, KPIs baselined |
| P5 | Full Production | Ongoing | All clinics onboarded, SLA monitoring live |

### 11.2 Infrastructure Checklist

1. Provision VPC, subnets, security groups (AWS / GCP)
2. Set up RDS PostgreSQL (Multi-AZ) with automated backups (daily, 30-day retention)
3. Configure S3 buckets with versioning + lifecycle policies
4. Deploy Redis cluster (ElastiCache / Redis Cloud) with AOF persistence
5. Set up ECS Fargate cluster with ALB + auto-scaling policies
6. Configure CloudFront CDN for frontend SPA and presigned file URLs
7. Set up Route 53 DNS, SSL certificates (ACM), and WAF rules
8. Configure Secrets Manager for all credentials; rotate every 90 days
9. Enable VPC Flow Logs, CloudTrail, and GuardDuty
10. Set up Prometheus + Grafana dashboards and PagerDuty alerting

### 11.3 CI/CD Pipeline

| Stage | Trigger | Actions |
|---|---|---|
| Lint & Test | Push to any branch | ESLint, Prettier, Jest unit tests, Zod validation tests |
| Integration Test | PR to main | API integration tests, DB migration tests |
| Security Scan | PR to main | npm audit, Snyk, OWASP ZAP scan |
| Build & Push | Merge to main | Docker build, tag with git SHA, push to ECR |
| Deploy Staging | Merge to main | ECS rolling deploy to staging, smoke tests |
| Deploy Production | Manual approval | Blue/green deploy to production, health check |
| Rollback | Automated (on health fail) | Revert to previous task definition |

---

## 12. Non-Functional Requirements

| Category | Requirement | Target |
|---|---|---|
| Performance | API response time (p95) | < 300 ms (excluding AI pipeline) |
| Performance | AI prescription processing | < 5 seconds end-to-end |
| Performance | Page load time (LCP) | < 2.5 seconds on 4G |
| Availability | System uptime | 99.9% monthly (< 44 min downtime) |
| Availability | RTO (Recovery Time Objective) | < 1 hour |
| Availability | RPO (Recovery Point Objective) | < 24 hours |
| Scalability | Concurrent users | Support 10,000 concurrent sessions |
| Scalability | Storage growth | Horizontally scalable S3-backed storage |
| Security | Vulnerability SLA (P0/Critical) | Patch within 24 hours of discovery |
| Usability | Accessibility | WCAG 2.1 AA compliant |
| Usability | Mobile support | iOS 15+ and Android 10+ (responsive web) |

---

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|
| OCR / AI extraction errors on handwritten prescriptions | High | High | Mandatory human review step before save; confidence score threshold |
| Data breach or unauthorised access | Low | Critical | AES-256, audit logs, pentest, MFA, rate limiting |
| Session key leakage (doctor access) | Low | High | Keys are hashed, short TTL, single-use validation, revocation API |
| Regulatory non-compliance (DPDP / GDPR) | Medium | High | DPO review, consent flows, right-to-delete, data minimisation |
| Vendor lock-in (AWS / OpenAI) | Medium | Medium | S3-compatible storage abstraction; OpenAI swappable via adapter pattern |
| System downtime during peak clinic hours | Low | High | Multi-AZ DB, ECS auto-scaling, blue-green deploys, health checks |
| Low elderly user adoption | Medium | Medium | Simplified onboarding, family-assisted setup mode, large-text UI option |
| LLM API rate limits during high upload volume | Medium | Medium | Bull queue with retry, batch processing, fallback to Tesseract-only |

---

## 14. Future Enhancements

| Enhancement | Phase | Description |
|---|---|---|
| Native Mobile Apps | Phase 2 | iOS and Android apps with camera-based prescription capture |
| Pharmacy Integration | Phase 2 | Send prescription to pharmacy directly; track dispensing status |
| Drug Interaction Alerts | Phase 2 | Real-time flag when new prescription conflicts with existing medicines |
| FHIR Interoperability | Phase 3 | HL7 FHIR R4 API for integration with hospital EMR systems |
| Health Analytics Dashboard | Phase 3 | Patient health trends, condition timeline, doctor visit frequency |
| Insurance Document Vault | Phase 3 | Upload and manage insurance cards, claim documents |
| Wearable Data Integration | Phase 3 | Sync with Apple Health / Google Fit for contextual health data |
| Multi-Language Support | Phase 3 | Malayalam, Hindi, Tamil UI localisation for regional clinics |
| Government Health Integration | Phase 4 | Ayushman Bharat / ABDM ABHA ID linking for national records |

---

## 15. Appendix

### A. AI Prompt Template — Prescription NER

System prompt used for LLM-based medical entity extraction:

```
You are a medical data extraction assistant. Extract the following entities
from the prescription text provided. Return ONLY a valid JSON object with
these keys: hospital_name, visit_date (ISO 8601), attending_doctor,
diagnoses (array), medicines (array of {name, dosage, frequency, duration,
instructions}), follow_up_date (ISO 8601 or null). If a field cannot be
determined, set it to null.
```

### B. Token Expiry Strategy

| Token Type | TTL | Storage | Rotation |
|---|---|---|---|
| JWT Access Token | 15 minutes | httpOnly cookie | On every API call |
| JWT Refresh Token | 7 days | httpOnly cookie | On refresh; old token revoked |
| Doctor Access Key | 30 min / 1 hr / 2 hr | DB (hashed) | Single use per session start |
| Email Verify Token | 24 hours | DB (hashed) | One-time use |
| Password Reset Token | 1 hour | DB (hashed) | One-time use |

### C. Rate Limiting Rules

| Endpoint Group | Limit | Window | Action on Breach |
|---|---|---|---|
| `POST /auth/login` | 10 requests | 15 minutes (per IP) | 429 + 15-min cooldown |
| `POST /auth/register` | 5 requests | 1 hour (per IP) | 429 + CAPTCHA required |
| `POST /prescriptions/upload` | 20 uploads | 1 hour (per user) | 429 + queue |
| `POST /access/validate` | 5 attempts | 5 minutes (per IP) | 429 + alert |
| `GET /search` | 60 requests | 1 minute (per user) | 429 |
| All other endpoints | 100 requests | 1 minute (per user) | 429 |

---

*PTIALRECORD · PRD v1.0 · Confidential · Private Hospitals & Clinics*
