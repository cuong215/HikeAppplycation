import * as SQLite from 'expo-sqlite';

let db = null;

export async function initDB() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('coursework.db');

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
      description TEXT,
      weatherForecast TEXT,
      maxGroupSize INTEGER
    );
  `);

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

export async function getAllHikes() {
  if (!db) await initDB();
  return await db.getAllAsync("SELECT * FROM hikes ORDER BY date DESC;");
}

export async function insertHike(h) {
  if (!db) await initDB();

  const name = h.name || ""; 
  const location = h.location || "";
  const date = h.date || "";
  const length = h.length || 0; 
  const duration = h.duration || null; 
  const difficulty = h.difficulty || "Easy";
  const parking = h.parking || "Yes";
  const trailType = h.trailType || "";
  const description = h.description || "";
  const weatherForecast = h.weatherForecast || "";
  const maxGroupSize = h.maxGroupSize || null;

  await db.runAsync(
    `INSERT INTO hikes 
    (name, location, date, length, duration, difficulty, parking, trailType,
     description, weatherForecast, maxGroupSize)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      name, location, date, length, duration, difficulty, parking, trailType,
      description, weatherForecast, maxGroupSize
    ]
  );
}

export async function updateHike(h) {
  if (!db) await initDB();

  const name = h.name || "";
  const location = h.location || "";
  const date = h.date || "";
  const length = h.length || 0;
  const duration = h.duration || null;
  const difficulty = h.difficulty || "Easy";
  const parking = h.parking || "Yes";
  const trailType = h.trailType || "";
  const description = h.description || "";
  const weatherForecast = h.weatherForecast || "";
  const maxGroupSize = h.maxGroupSize || null;
  const id = h.id;

  await db.runAsync(
    `UPDATE hikes SET 
      name=?, location=?, date=?, length=?, duration=?, difficulty=?, parking=?, trailType=?, 
      description=?, weatherForecast=?, maxGroupSize=?
    WHERE id=?;`,
    [
      name, location, date, length, duration, difficulty, parking, trailType,
      description, weatherForecast, maxGroupSize, id
    ]
  );
}

export async function deleteHike(id) {
  if (!db) await initDB();
  await db.runAsync("DELETE FROM observations WHERE hikeId=?;", [id]);
  await db.runAsync("DELETE FROM hikes WHERE id=?;", [id]);
}

export async function searchHikesByName(keyword) {
  if (!db) await initDB();
  const searchTerm = keyword || "";

  console.log("Đang tìm kiếm mở rộng:", searchTerm);

  // Thêm các điều kiện OR để tìm trong Description, Difficulty, TrailType
  return await db.getAllAsync(
    `SELECT * FROM hikes 
     WHERE name LIKE ? 
        OR location LIKE ? 
        OR description LIKE ? 
        OR difficulty LIKE ? 
        OR trailType LIKE ?
     ORDER BY date DESC`,
    [
      `%${searchTerm}%`, // Cho name
      `%${searchTerm}%`, // Cho location
      `%${searchTerm}%`, // Cho description
      `%${searchTerm}%`, // Cho difficulty
      `%${searchTerm}%`  // Cho trailType
    ]
  );
}

export async function getObservationsByHike(id) {
  if (!db) await initDB();
  return await db.getAllAsync(
    "SELECT * FROM observations WHERE hikeId=? ORDER BY time DESC;",
    [id]
  );
}

export async function insertObservation(obs) {
  if (!db) await initDB();
  await db.runAsync(
    `INSERT INTO observations (hikeId, observationText, time, comments)
      VALUES (?, ?, ?, ?);`,
    [
        obs.hikeId, 
        obs.observationText || "", 
        obs.time || new Date().toISOString(), 
        obs.comments || ""
    ]
  );
}

export async function updateObservation(obs) {
  if (!db) await initDB();
  await db.runAsync(
    `UPDATE observations 
     SET observationText=?, time=?, comments=? 
     WHERE id=?;`,
    [
      obs.observationText,
      obs.time,
      obs.comments || "",
      obs.id
    ]
  );
}

export async function getObservationById(id) {
  if (!db) await initDB();
  const res = await db.getAllAsync(
    "SELECT * FROM observations WHERE id=?;",
    [id]
  );
  return res[0];
}

export async function deleteObservation(id) {
  if (!db) await initDB();
  await db.runAsync("DELETE FROM observations WHERE id=?;", [id]);
}

export async function deleteAllData() {
    if (!db) await initDB();
    await db.runAsync("DELETE FROM observations;");
    await db.runAsync("DELETE FROM hikes;");
}