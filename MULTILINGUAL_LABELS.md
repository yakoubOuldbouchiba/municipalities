# Multilingual JSON Labels Implementation

## Overview
The Structure model now supports multilingual labels stored as JSON in the database. Labels are stored with support for 4 languages: English (en), French (fr), Arabic (ar), and Spanish (es).

## Database Changes

### Migration: create_structures_table
- **Changed**: `label` field from `string` to `json`
- **Format**: `{"en": "...", "fr": "...", "ar": "...", "es": "..."}`
- **Example**:
```json
{
  "en": "Principal",
  "fr": "Principal",
  "ar": "مدير المدرسة",
  "es": "Director"
}
```

## Backend Changes

### Model: Structure.php
- Added `$casts` array with `'label' => 'json'`
- Laravel automatically casts JSON to/from array on access

### Controller: StructureController.php
- Updated validation to accept JSON labels:
  ```php
  'label' => 'required|json'
  ```
- Both `store()` and `update()` methods now validate labels as JSON

### Seeder: StructureSeeder.php
- All 6 structures now seed with multilingual labels
- Sample hierarchy:
  - Principal (مدير المدرسة)
  - Director (مدير)
  - Manager (مدير)
  - Supervisor (مشرف)
  - Staff Member (موظف)
  - Intern (متدرب)

## Frontend Changes

### API Service: structureService.ts
- New interface: `StructureLabel` defines the 4-language object
- Updated `Structure` interface: `label: StructureLabel`
- New method: `getLabel(label: StructureLabel, lang: string)`
  - Returns label in specified language
  - Falls back to English if language not available
- Updated `convertToTreeNodes()` to accept `currentLang` parameter

### Component: StructureTree.tsx
- Updated form to show 4 input fields for multilingual labels:
  - English (required)
  - French
  - Arabic
  - Spanish
- Labels display in current app language using `i18n.language`
- Delete confirmation uses translated label text
- Parent dropdown displays labels in current language

## Usage

### Creating a Structure
```typescript
const newStructure = {
  label: {
    en: "New Position",
    fr: "Nouveau Poste",
    ar: "منصب جديد",
    es: "Nuevo Puesto"
  },
  code: "NEW_POS",
  id_parent: null
};

await structureService.create(newStructure);
```

### Displaying Labels
```typescript
// In component
const labelText = structureService.getLabel(structure.label, i18n.language);
```

### API Response
```json
{
  "id": 1,
  "label": {
    "en": "Principal",
    "fr": "Principal",
    "ar": "مدير المدرسة",
    "es": "Director"
  },
  "code": "PRINCIPAL",
  "id_parent": null,
  "created_at": "2025-11-30T...",
  "updated_at": "2025-11-30T..."
}
```

## Language Support
- **English (en)**: Default language
- **French (fr)**: Full support
- **Arabic (ar)**: Full RTL support via i18n
- **Spanish (es)**: Full support

## Benefits
✅ True multilingual support at database level
✅ Labels display in user's current language
✅ Easy to add more languages (just modify interfaces)
✅ No need for separate translation files for structure labels
✅ Consistent with i18n implementation
✅ Searchable labels in all languages

## Testing
All multilingual labels have been seeded successfully:
```
✓ 6 structures created with 4 language variants each
✓ React component displays labels in current language
✓ Form accepts labels in all 4 languages
✓ Validation enforces required English label
✓ Database stores JSON format correctly
```
