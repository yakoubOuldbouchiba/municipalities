# Module System - Quick Guide 🎯

## The 3 Modules

### 1️⃣ Admin Module (Blue 🔒)
**Purpose**: Administrative controls
- Users management
- Groups management  
- Roles & permissions
- Applications

### 2️⃣ Website Module (Green 🌐)
**Purpose**: Website content management
- Advertisements
- News
- Events
- Papers
- Quick Links
- Important Numbers
- Potentials
- Persons

### 3️⃣ Claims Module (Amber 📤)
**Purpose**: Claims processing
- Citizen Claims
- Company Claims
- Organization Claims

---

## How to Use

### From Dashboard
1. Go to home page (`/`)
2. See 3 module cards
3. Click a card to activate it
4. View module details below

### From Sidebar
1. Look at top of sidebar
2. See 3 module buttons
3. Click a button to switch
4. Sidebar navigation updates automatically

### Active Module
- Currently selected module is highlighted in blue
- Sidebar shows ONLY that module's navigation items
- Click navigation items to view pages

---

## Visual Layout

```
┌─────────────────────────────────────┐
│ Admin Panel                         │
├─────────────────────────────────────┤
│ [Admin] [Website] [Claims]          │  ← Module Selector
├─────────────────────────────────────┤
│                                     │
│ ○ Users                             │  ← Current Module
│ ○ Groups                               (Dynamic Navigation)
│ ○ Roles                             │
│ ○ Applications                      │
│                                     │
└─────────────────────────────────────┘
```

---

## Routes

### Admin Module Routes
```
/admin/users                 → Users Page
/admin/groups               → Groups Page
/admin/roles                → Roles Page
/admin/applications         → Applications Page
```

### Website Module Routes
```
/ads                        → Advertisements
/news                       → News
/events                     → Events
/papers                     → Papers
/quick-links                → Quick Links
/important-numbers          → Important Numbers
/potentials                 → Potentials
/persons                    → Persons
```

### Claims Module Routes
```
/claims/citizen             → Citizen Claims
/claims/company             → Company Claims
/claims/organization        → Organization Claims
```

---

## Dashboard Cards

When you visit `/`, you see:
- **Admin Module Card** - Shows 4 admin items
- **Website Module Card** - Shows 8 website items  
- **Claims Module Card** - Shows 3 claims items

Each card is clickable to activate the module.

Below the cards is a detailed view of the **currently active module** showing:
- Module icon and name
- All navigation items with their paths
- Color indicator

---

## Sidebar Navigation

The sidebar always shows:
1. **Module Switcher** (top section)
   - 3 buttons for Admin, Website, Claims
   - Active module is highlighted
   
2. **Current Module Info** (below switcher)
   - Icon and name of active module
   - Color indicator

3. **Navigation Items** (rest of sidebar)
   - Items specific to active module
   - Click to navigate to pages

---

## Color Scheme

| Module | Color | Hex |
|--------|-------|-----|
| Admin | Blue | #3b82f6 |
| Website | Green | #10b981 |
| Claims | Amber | #f59e0b |

---

## Code Example

Get current module in any component:

```tsx
import { useModule } from '../context/ModuleContext';

function MyComponent() {
  const { currentModule, moduleConfig, setCurrentModule } = useModule();
  
  return (
    <div>
      <p>Current: {moduleConfig.name}</p>
      <button onClick={() => setCurrentModule('claims')}>
        Switch to Claims
      </button>
    </div>
  );
}
```

---

## Summary

✨ **Features**:
- 3 pre-configured modules
- Dynamic sidebar navigation
- Beautiful dashboard display
- Easy module switching
- Color-coded identification
- Fully responsive design

🚀 **Ready to use!**
