# Missing i18n Keys Report for UsersPage

## Summary
Analysis of all translation keys used in `UsersPage.tsx` against the i18n JSON files.

## Translation Keys Used in UsersPage.tsx

### Common Keys
- ✅ `common.error`
- ✅ `common.validation`
- ✅ `common.success`
- ✅ `common.confirm`
- ✅ `common.active`
- ✅ `common.inactive`
- ✅ `common.edit`
- ✅ `common.delete`
- ✅ `common.add`
- ✅ `common.cancel`
- ✅ `common.save`
- ✅ `common.actions`
- ✅ `common.noData`

### Users Keys
- ✅ `users.title`
- ✅ `users.description`
- ✅ `users.createTitle`
- ✅ `users.editTitle`
- ✅ `users.errorFetch`
- ✅ `users.errorLoading`
- ✅ `users.errorSave`
- ✅ `users.errorDelete`
- ✅ `users.updateSuccess`
- ✅ `users.createSuccess`
- ✅ `users.deleteSuccess`
- ✅ `users.confirmDelete`
- ✅ `users.searchPlaceholder`
- ✅ `users.nameRequired`
- ✅ `users.emailRequired`
- ✅ `users.invalidEmail`
- ✅ `users.passwordRequired`
- ✅ `users.passwordMismatch`
- ✅ `users.selectGroups`
- ✅ `users.selectRoles`
- ✅ `users.selectStructures`

### Users Field Keys
- ✅ `users.fields.name`
- ✅ `users.fields.email`
- ✅ `users.fields.firstName`
- ✅ `users.fields.lastName`
- ✅ `users.fields.status`
- ✅ `users.fields.groups`
- ✅ `users.fields.roles`
- ✅ `users.fields.structures`
- ✅ `users.fields.nin` ❌ **MISSING**
- ✅ `users.fields.gender`
- ✅ `users.fields.birthdate` ❌ **MISSING**
- ✅ `users.fields.birthplace` ❌ **MISSING**
- ✅ `users.fields.address` ❌ **MISSING**
- ✅ `users.fields.city` ❌ **MISSING**
- ✅ `users.fields.country` ❌ **MISSING**
- ✅ `users.fields.password`
- ✅ `users.fields.confirmPassword`
- ✅ `users.fields.phone` ❌ **MISSING**
- ✅ `users.fields.iphone` ❌ **MISSING**

### Users Gender Keys
- ✅ `users.gender.male`
- ✅ `users.gender.female`

## Missing Keys (Need to be added)

| Key | Languages Missing | Used For |
|-----|-------------------|----------|
| `users.fields.nin` | en, fr, ar | NIN field label |
| `users.fields.birthdate` | en, fr, ar | Birthdate field label |
| `users.fields.birthplace` | en, fr, ar | Birthplace field label |
| `users.fields.address` | en, fr, ar | Address section header |
| `users.fields.city` | en, fr, ar | City field label |
| `users.fields.country` | en, fr, ar | Country field label |
| `users.fields.phone` | en, fr, ar | Phone field label |
| `users.fields.iphone` | en, fr, ar | iPhone field label |

## Files That Need Updates
1. `/admin-portal/src/i18n/locales/en.json`
2. `/admin-portal/src/i18n/locales/fr.json`
3. `/admin-portal/src/i18n/locales/ar.json`

## Translation Values to Add

### English (en.json)
```json
"users": {
  "fields": {
    "nin": "NIN",
    "birthdate": "Birthdate",
    "birthplace": "Birthplace",
    "address": "Address",
    "city": "City",
    "country": "Country",
    "phone": "Phone",
    "iphone": "iPhone"
  }
}
```

### French (fr.json)
```json
"users": {
  "fields": {
    "nin": "NIN",
    "birthdate": "Date de naissance",
    "birthplace": "Lieu de naissance",
    "address": "Adresse",
    "city": "Ville",
    "country": "Pays",
    "phone": "Téléphone",
    "iphone": "iPhone"
  }
}
```

### Arabic (ar.json)
```json
"users": {
  "fields": {
    "nin": "رقم الهوية الوطنية",
    "birthdate": "تاريخ الميلاد",
    "birthplace": "مكان الميلاد",
    "address": "العنوان",
    "city": "المدينة",
    "country": "الدولة",
    "phone": "الهاتف",
    "iphone": "آيفون"
  }
}
```

## Status
**8 missing keys** across **3 languages** (24 total missing entries)
