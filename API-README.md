# 📘 Edit Log API

Built with **Next** and **Postgres (Neon)**

---

## 🔗 Base URL
```
http://localhost:3000/api
```

---

## 📂 Routes

### **1. Get All Entries**
```
GET /entries
```
**Description**: Returns all entries in the database.  

**Example Response**:
```json
[
  {
    "id": "9e6b3d93-32a3-4d92-ba3f-8a8d3a9b0846",
    "entry_date": "2025-09-24",
    "start_minutes": 480,
    "end_minutes": 720,
    "notes": "Worked on film editing"
  }
]
```

---

### **2. Get Single Entry**
```
GET /entry/:id
```
**Description**: Returns a single entry by ID.  

**Example**:
```
GET /entry/9e6b3d93-32a3-4d92-ba3f-8a8d3a9b0846
```

**Example Response**:
```json
{
  "id": "9e6b3d93-32a3-4d92-ba3f-8a8d3a9b0846",
  "entry_date": "2025-09-24",
  "start_minutes": 480,
  "end_minutes": 720,
  "notes": "Worked on film editing"
}
```

---

### **3. Create Entry**
```
POST /entry
```
**Description**: Adds a new entry.  

**Body**:
```json
{
  "entry_date": "2025-09-24",
  "start_minutes": 480,
  "end_minutes": 720,
  "notes": "Worked on film editing"
}
```

**Response**:
```json
{ "success": true, "id": "generated-uuid" }
```

---

### **4. Update Entry**
```
PUT /entry/:id
```
**Description**: Updates an existing entry.  

**Body**:
```json
{
  "start_minutes": 500,
  "end_minutes": 740
}
```

**Response**:
```json
{ "success": true }
```

---

### **5. Delete Entry**
```
DELETE /entry/:id
```
**Description**: Deletes an entry.  

**Response**:
```json
{ "success": true }
```

---

### **6. Get Entry Count**
```
GET /entries/count
```
**Description**: Returns the total number of entries.  

**Query Parameters**:
- `filter=day` → Count entries from **today**  
- `filter=week` → Count entries from **this week**  
- `filter=month` → Count entries from **this month**  
- `start=YYYY-MM-DD&end=YYYY-MM-DD` → Count entries in a custom date range *(optional, if implemented)*  

**Examples**:
```
GET /entries/count
GET /entries/count?filter=day
GET /entries/count?filter=week
GET /entries/count?start=2025-09-01&end=2025-09-24
```

**Example Response**:
```json
{ "count": 42 }
```

---

## ⚠️ Notes
- All routes return JSON.  
- Errors return a `500` with `{ "error": "message" }`.  
- `entry_date` is stored as a `DATE` in Postgres.  
- `start_minutes` and `end_minutes` represent minutes since midnight.  
