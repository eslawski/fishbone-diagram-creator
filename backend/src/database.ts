import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const dbPath = path.join(__dirname, '../db/fishbone.db');

interface User {
  id: string;
  name: string;
}

interface Diagram {
  id: string;
  user_id: string;
  problem: string;
  causes: string; // JSON string
}

interface CountResult {
  count: number;
}

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.serialize(() => {
      // Create users table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL
        )
      `);

      // Create diagrams table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS diagrams (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          problem TEXT NOT NULL,
          causes TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Insert seed data for 5 users
      this.insertSeedData();
    });
  }

    private insertSeedData(): void {
    // Check if seed data already exists
    this.db.get('SELECT COUNT(*) as count FROM users', (err, row: CountResult) => {
      if (err || (row && row.count > 0)) {
        return; // Seed data already exists
      }
      
      const users = [
        { id: uuidv4(), name: 'Alice Johnson' },
        { id: uuidv4(), name: 'Bob Smith' },
        { id: uuidv4(), name: 'Carol Davis' },
        { id: uuidv4(), name: 'David Wilson' },
        { id: uuidv4(), name: 'Eva Brown' }
      ];

      const stmt = this.db.prepare('INSERT INTO users (id, name) VALUES (?, ?)');
      
      users.forEach(user => {
        stmt.run(user.id, user.name);
      });

      stmt.finalize();

      // Insert sample diagrams for the first user
      const sampleCauses = JSON.stringify([
        {
          id: 1,
          name: "Development Process",
          causes: [
            {
              id: 2,
              name: "Code Review",
              notes: "Lack of thorough code review process",
              causes: [
                {
                  id: 3,
                  name: "Time Pressure",
                },
              ],
            },
            {
              id: 4,
              name: "Testing",
            },
          ],
        },
        {
          id: 5,
          name: "Environment Issues",
          causes: [
            {
              id: 6,
              name: "Configuration",
            },
            {
              id: 7,
              name: "Dependencies",
            },
          ]
        }
      ]);

      const diagramStmt = this.db.prepare(`
        INSERT INTO diagrams (id, user_id, problem, causes) 
        VALUES (?, ?, ?, ?)
      `);

      diagramStmt.run(
        uuidv4(),
        users[0].id,
        "Too many bugs in production code!",
        sampleCauses
      );

      diagramStmt.finalize();
    });
  }

  public getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users', (err, rows: User[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  public getUserDiagrams(userId: string): Promise<Diagram[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM diagrams WHERE user_id = ?',
        [userId],
        (err, rows: Diagram[]) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  public getDiagram(userId: string, diagramId: string): Promise<Diagram | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM diagrams WHERE user_id = ? AND id = ?',
        [userId, diagramId],
        (err, row: Diagram) => {
          if (err) reject(err);
          else resolve(row || null);
        }
      );
    });
  }

  public close(): void {
    this.db.close();
  }
}
