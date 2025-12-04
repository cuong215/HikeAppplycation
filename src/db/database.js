import * as SQLite from 'expo-sqlite';

let db = null;

export async function initDB() {
  if (db) return db;
  
  // 1. Mở database
  db = await SQLite.openDatabaseAsync('coursework.db');

  // 2. Tạo bảng hikes (Đã kiểm tra kỹ cú pháp: KHÔNG CÓ DẤU PHẨY CUỐI CÙNG)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS hikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      length REAL NOT NULL,
      duration REAL,
      difficulty TEXT NOT NULL,
      parking TEXT NOT NULL,
      trailType TEXT,
      description TEXT
    );
  `);

  // 3. Tạo bảng observations
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hikeId INTEGER NOT NULL,
      observationText TEXT NOT NULL,
      time TEXT NOT NULL,
      comments TEXT,
      FOREIGN KEY(hikeId) REFERENCES hikes(id)
    );
  `);

  return db;
}

// --- HÀM HELPER ĐỂ CHUYỂN UNDEFINED THÀNH NULL ---
// SQLite sẽ crash nếu tham số là undefined. Hàm này giúp an toàn hơn.
const sanitize = (val) => (val === undefined ? null : val);

export async function getAllHikes() {
  const database = await initDB();
  return await database.getAllAsync("SELECT * FROM hikes ORDER BY date DESC;");
}

export async function insertHike(h) {
  const database = await initDB();
  
  // Đảm bảo dữ liệu đầu vào an toàn
  const name = h.name || "Untitled"; 
  const location = h.location || "Unknown";
  const date = h.date || new Date().toISOString().split('T')[0];
  const length = parseFloat(h.length) || 0; 
  const duration = parseFloat(h.duration) || 0; 
  const difficulty = h.difficulty || "Easy";
  const parking = h.parking || "Yes";
  const trailType = h.trailType || "";
  const description = h.description || "";

  const result = await database.runAsync(
    `INSERT INTO hikes (name, location, date, length, duration, difficulty, parking, trailType, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [name, location, date, length, duration, difficulty, parking, trailType, description]
  );
  return result;
}

export async function updateHike(h) {
  const database = await initDB();

  const name = h.name || "Untitled";
  const location = h.location || "";
  const date = h.date || "";
  const length = parseFloat(h.length) || 0;
  const duration = parseFloat(h.duration) || 0;
  const difficulty = h.difficulty || "Easy";
  const parking = h.parking || "Yes";
  const trailType = h.trailType || "";
  const description = h.description || "";
  const id = h.id;

  if (!id) throw new Error("Missing ID for updateHike");

  await database.runAsync(
    `UPDATE hikes SET name=?, location=?, date=?, length=?, duration=?, difficulty=?, parking=?, trailType=?, description=? WHERE id=?;`,
    [name, location, date, length, duration, difficulty, parking, trailType, description, id]
  );
}

export async function deleteHike(id) {
  const database = await initDB();
  await database.runAsync("DELETE FROM observations WHERE hikeId=?;", [id]);
  await database.runAsync("DELETE FROM hikes WHERE id=?;", [id]);
}

export async function searchHikesByName(keyword) {
  const database = await initDB();
  const term = keyword || "";
  const searchPattern = `%${term}%`;
  
  // Truyền đúng 5 tham số cho 5 dấu hỏi (?)
  return await database.getAllAsync(
    `SELECT * FROM hikes 
     WHERE name LIKE ? 
        OR location LIKE ? 
        OR description LIKE ? 
        OR difficulty LIKE ? 
        OR trailType LIKE ?
     ORDER BY date DESC`,
    [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]
  );
}

export async function getObservationsByHike(id) {
  const database = await initDB();
  return await database.getAllAsync(
    "SELECT * FROM observations WHERE hikeId=? ORDER BY time DESC;",
    [id]
  );
}

export async function insertObservation(obs) {
  const database = await initDB();

  if (!obs.hikeId) {
    throw new Error("hikeId is required");
  }

  await database.runAsync(
    `INSERT INTO observations (hikeId, observationText, time, comments) VALUES (?, ?, ?, ?);`,
    [
       sanitize(obs.hikeId), 
       sanitize(obs.observationText || "No text"),
       sanitize(obs.time || new Date().toISOString()), 
       sanitize(obs.comments || "")
    ]
  );
}

export async function updateObservation(obs) {
  const database = await initDB();
  await database.runAsync(
    `UPDATE observations SET observationText=?, time=?, comments=? WHERE id=?;`,
    [
      sanitize(obs.observationText), 
      sanitize(obs.time), 
      sanitize(obs.comments || ""), 
      sanitize(obs.id)
    ]
  );
}

export async function getObservationById(id) {
  const database = await initDB();
  const res = await database.getAllAsync("SELECT * FROM observations WHERE id=?;", [id]);
  return res[0];
}

export async function deleteObservation(id) {
  const database = await initDB();
  await database.runAsync("DELETE FROM observations WHERE id=?;", [id]);
}

export async function deleteAllData() {
    const database = await initDB();
    await database.runAsync("DELETE FROM observations;");
    await database.runAsync("DELETE FROM hikes;");
}