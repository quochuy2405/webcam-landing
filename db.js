import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Hàm mở kết nối với database
const openDb = async () => {
  const db = await open({
    filename: './database.sqlite', // Đường dẫn đến file SQLite
    driver: sqlite3.Database,
  });

  // Tạo bảng nếu chưa tồn tại
  await db.exec(`
        CREATE TABLE IF NOT EXISTS environment_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            temperature REAL,
            humidity REAL,
            ph REAL
        );
    `);

  return db;
};

export default openDb;
