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

      // Insert comprehensive diagrams for each user

      // Alice Johnson - Software Development Issues
      const aliceDiagrams = [
        {
          problem: "Too many bugs in production code!",
          causes: [
            {
              id: 1,
              name: "Development Process",
              causes: [
                {
                  id: 2,
                  name: "Code Review",
                  notes: "Lack of thorough code review process",
                  causes: [
                    { id: 3, name: "Time Pressure" },
                    { id: 4, name: "Insufficient Training" }
                  ]
                },
                {
                  id: 5,
                  name: "Testing",
                  causes: [
                    { id: 6, name: "Unit Test Coverage" },
                    { id: 7, name: "Integration Testing" }
                  ]
                }
              ]
            },
            {
              id: 8,
              name: "Environment Issues",
              causes: [
                { id: 9, name: "Configuration Management" },
                { id: 10, name: "Dependency Conflicts" }
              ]
            },
            {
              id: 11,
              name: "Team Communication",
              causes: [
                { id: 12, name: "Documentation" },
                { id: 13, name: "Knowledge Sharing" }
              ]
            },
            {
              id: 14,
              name: "Code Quality",
              causes: [
                { id: 15, name: "Coding Standards" },
                { id: 16, name: "Refactoring Practices" }
              ]
            }
          ]
        },
        {
          problem: "Slow application performance",
          causes: [
            {
              id: 17,
              name: "Database Issues",
              causes: [
                { id: 18, name: "Query Optimization" },
                { id: 19, name: "Index Management" }
              ]
            },
            {
              id: 20,
              name: "Frontend Performance",
              causes: [
                { id: 21, name: "Bundle Size" },
                { id: 22, name: "Rendering Optimization" }
              ]
            },
            {
              id: 23,
              name: "Infrastructure",
              causes: [
                { id: 24, name: "Server Resources" },
                { id: 25, name: "Network Latency" }
              ]
            },
            {
              id: 26,
              name: "Caching Strategy",
              causes: [
                { id: 27, name: "Application Cache" },
                { id: 28, name: "CDN Configuration" }
              ]
            }
          ]
        },
        {
          problem: "Security vulnerabilities in web application",
          causes: [
            {
              id: 29,
              name: "Input Validation",
              causes: [
                { id: 30, name: "SQL Injection Prevention" },
                { id: 31, name: "XSS Protection" }
              ]
            },
            {
              id: 32,
              name: "Authentication",
              causes: [
                { id: 33, name: "Password Policies" },
                { id: 34, name: "Session Management" }
              ]
            },
            {
              id: 35,
              name: "Authorization",
              causes: [
                { id: 36, name: "Role-Based Access" },
                { id: 37, name: "Permission Checks" }
              ]
            },
            {
              id: 38,
              name: "Data Protection",
              causes: [
                { id: 39, name: "Encryption" },
                { id: 40, name: "Data Sanitization" }
              ]
            }
          ]
        }
      ];

      // Bob Smith - Marketing Problems
      const bobDiagrams = [
        {
          problem: "Low customer engagement on social media",
          causes: [
            {
              id: 41,
              name: "Content Strategy",
              causes: [
                { id: 42, name: "Content Quality" },
                { id: 43, name: "Posting Frequency" }
              ]
            },
            {
              id: 44,
              name: "Audience Targeting",
              causes: [
                { id: 45, name: "Demographic Analysis" },
                { id: 46, name: "Interest Mapping" }
              ]
            },
            {
              id: 47,
              name: "Platform Selection",
              causes: [
                { id: 48, name: "Channel Effectiveness" },
                { id: 49, name: "Platform Features" }
              ]
            },
            {
              id: 50,
              name: "Engagement Tactics",
              causes: [
                { id: 51, name: "Interactive Content" },
                { id: 52, name: "Community Building" }
              ]
            }
          ]
        },
        {
          problem: "Poor conversion rates in email campaigns",
          causes: [
            {
              id: 53,
              name: "Email Design",
              causes: [
                { id: 54, name: "Visual Appeal" },
                { id: 55, name: "Mobile Optimization" }
              ]
            },
            {
              id: 56,
              name: "Subject Lines",
              causes: [
                { id: 57, name: "Personalization" },
                { id: 58, name: "A/B Testing" }
              ]
            },
            {
              id: 59,
              name: "List Quality",
              causes: [
                { id: 60, name: "Segmentation" },
                { id: 61, name: "List Hygiene" }
              ]
            },
            {
              id: 62,
              name: "Call-to-Action",
              causes: [
                { id: 63, name: "Button Design" },
                { id: 64, name: "Placement Strategy" }
              ]
            }
          ]
        },
        {
          problem: "Brand awareness not growing",
          causes: [
            {
              id: 65,
              name: "Advertising Strategy",
              causes: [
                { id: 66, name: "Media Mix" },
                { id: 67, name: "Creative Quality" }
              ]
            },
            {
              id: 68,
              name: "Public Relations",
              causes: [
                { id: 69, name: "Press Coverage" },
                { id: 70, name: "Event Participation" }
              ]
            },
            {
              id: 71,
              name: "Partnerships",
              causes: [
                { id: 72, name: "Strategic Alliances" },
                { id: 73, name: "Influencer Marketing" }
              ]
            },
            {
              id: 74,
              name: "Content Marketing",
              causes: [
                { id: 75, name: "SEO Strategy" },
                { id: 76, name: "Thought Leadership" }
              ]
            }
          ]
        }
      ];

      // Carol Davis - Customer Service Issues
      const carolDiagrams = [
        {
          problem: "Long customer wait times",
          causes: [
            {
              id: 77,
              name: "Staffing Issues",
              causes: [
                { id: 78, name: "Agent Availability" },
                { id: 79, name: "Training Requirements" }
              ]
            },
            {
              id: 80,
              name: "Process Efficiency",
              causes: [
                { id: 81, name: "Workflow Design" },
                { id: 82, name: "Tool Integration" }
              ]
            },
            {
              id: 83,
              name: "Technology",
              causes: [
                { id: 84, name: "System Performance" },
                { id: 85, name: "Automation Level" }
              ]
            },
            {
              id: 86,
              name: "Queue Management",
              causes: [
                { id: 87, name: "Priority System" },
                { id: 88, name: "Routing Logic" }
              ]
            }
          ]
        },
        {
          problem: "Customer satisfaction scores declining",
          causes: [
            {
              id: 89,
              name: "Service Quality",
              causes: [
                { id: 90, name: "Agent Skills" },
                { id: 91, name: "Service Standards" }
              ]
            },
            {
              id: 92,
              name: "Communication",
              causes: [
                { id: 93, name: "Response Clarity" },
                { id: 94, name: "Follow-up Process" }
              ]
            },
            {
              id: 95,
              name: "Problem Resolution",
              causes: [
                { id: 96, name: "First Call Resolution" },
                { id: 97, name: "Escalation Process" }
              ]
            },
            {
              id: 98,
              name: "Customer Experience",
              causes: [
                { id: 99, name: "Touchpoint Design" },
                { id: 100, name: "Personalization" }
              ]
            }
          ]
        },
        {
          problem: "High customer churn rate",
          causes: [
            {
              id: 101,
              name: "Product Issues",
              causes: [
                { id: 102, name: "Feature Gaps" },
                { id: 103, name: "Reliability Problems" }
              ]
            },
            {
              id: 104,
              name: "Competition",
              causes: [
                { id: 105, name: "Market Position" },
                { id: 106, name: "Pricing Strategy" }
              ]
            },
            {
              id: 107,
              name: "Customer Support",
              causes: [
                { id: 108, name: "Response Time" },
                { id: 109, name: "Support Quality" }
              ]
            },
            {
              id: 110,
              name: "Value Proposition",
              causes: [
                { id: 111, name: "ROI Demonstration" },
                { id: 112, name: "Feature Benefits" }
              ]
            }
          ]
        }
      ];

      // David Wilson - Manufacturing Problems
      const davidDiagrams = [
        {
          problem: "Product quality defects increasing",
          causes: [
            {
              id: 113,
              name: "Raw Materials",
              causes: [
                { id: 114, name: "Supplier Quality" },
                { id: 115, name: "Material Testing" }
              ]
            },
            {
              id: 116,
              name: "Production Process",
              causes: [
                { id: 117, name: "Equipment Calibration" },
                { id: 118, name: "Process Parameters" }
              ]
            },
            {
              id: 119,
              name: "Human Factors",
              causes: [
                { id: 120, name: "Operator Training" },
                { id: 121, name: "Work Procedures" }
              ]
            },
            {
              id: 122,
              name: "Quality Control",
              causes: [
                { id: 123, name: "Inspection Process" },
                { id: 124, name: "Testing Methods" }
              ]
            }
          ]
        },
        {
          problem: "Production delays and missed deadlines",
          causes: [
            {
              id: 125,
              name: "Equipment Issues",
              causes: [
                { id: 126, name: "Maintenance Schedule" },
                { id: 127, name: "Breakdown Frequency" }
              ]
            },
            {
              id: 128,
              name: "Supply Chain",
              causes: [
                { id: 129, name: "Vendor Reliability" },
                { id: 130, name: "Inventory Management" }
              ]
            },
            {
              id: 131,
              name: "Workforce",
              causes: [
                { id: 132, name: "Staffing Levels" },
                { id: 133, name: "Skill Availability" }
              ]
            },
            {
              id: 134,
              name: "Planning",
              causes: [
                { id: 135, name: "Production Scheduling" },
                { id: 136, name: "Capacity Planning" }
              ]
            }
          ]
        },
        {
          problem: "High production costs",
          causes: [
            {
              id: 137,
              name: "Energy Usage",
              causes: [
                { id: 138, name: "Equipment Efficiency" },
                { id: 139, name: "Process Optimization" }
              ]
            },
            {
              id: 140,
              name: "Labor Costs",
              causes: [
                { id: 141, name: "Productivity Levels" },
                { id: 142, name: "Overtime Usage" }
              ]
            },
            {
              id: 143,
              name: "Waste Management",
              causes: [
                { id: 144, name: "Scrap Reduction" },
                { id: 145, name: "Recycling Programs" }
              ]
            },
            {
              id: 146,
              name: "Overhead",
              causes: [
                { id: 147, name: "Facility Costs" },
                { id: 148, name: "Administrative Expenses" }
              ]
            }
          ]
        }
      ];

      // Eva Brown - Healthcare Issues
      const evaDiagrams = [
        {
          problem: "Patient wait times too long",
          causes: [
            {
              id: 149,
              name: "Staffing",
              causes: [
                { id: 150, name: "Nurse Availability" },
                { id: 151, name: "Doctor Schedules" }
              ]
            },
            {
              id: 152,
              name: "Process Flow",
              causes: [
                { id: 153, name: "Registration Process" },
                { id: 154, name: "Triage System" }
              ]
            },
            {
              id: 155,
              name: "Facility",
              causes: [
                { id: 156, name: "Room Availability" },
                { id: 157, name: "Equipment Access" }
              ]
            },
            {
              id: 158,
              name: "Communication",
              causes: [
                { id: 159, name: "Patient Updates" },
                { id: 160, name: "Staff Coordination" }
              ]
            }
          ]
        },
        {
          problem: "Medical errors occurring",
          causes: [
            {
              id: 161,
              name: "Medication Management",
              causes: [
                { id: 162, name: "Prescription Process" },
                { id: 163, name: "Dosage Verification" }
              ]
            },
            {
              id: 164,
              name: "Documentation",
              causes: [
                { id: 165, name: "Chart Accuracy" },
                { id: 166, name: "Information Transfer" }
              ]
            },
            {
              id: 167,
              name: "Training",
              causes: [
                { id: 168, name: "Clinical Skills" },
                { id: 169, name: "Safety Protocols" }
              ]
            },
            {
              id: 170,
              name: "System Design",
              causes: [
                { id: 171, name: "Error Prevention" },
                { id: 172, name: "Alert Systems" }
              ]
            }
          ]
        },
        {
          problem: "Patient satisfaction declining",
          causes: [
            {
              id: 173,
              name: "Care Quality",
              causes: [
                { id: 174, name: "Treatment Effectiveness" },
                { id: 175, name: "Outcome Management" }
              ]
            },
            {
              id: 176,
              name: "Patient Experience",
              causes: [
                { id: 177, name: "Comfort Measures" },
                { id: 178, name: "Environment Quality" }
              ]
            },
            {
              id: 179,
              name: "Communication",
              causes: [
                { id: 180, name: "Doctor-Patient Interaction" },
                { id: 181, name: "Information Sharing" }
              ]
            },
            {
              id: 182,
              name: "Accessibility",
              causes: [
                { id: 183, name: "Appointment Availability" },
                { id: 184, name: "Location Convenience" }
              ]
            }
          ]
        }
      ];

      // Insert all diagrams
      const allDiagrams = [
        ...aliceDiagrams.map(d => ({ ...d, user_id: users[0].id })),
        ...bobDiagrams.map(d => ({ ...d, user_id: users[1].id })),
        ...carolDiagrams.map(d => ({ ...d, user_id: users[2].id })),
        ...davidDiagrams.map(d => ({ ...d, user_id: users[3].id })),
        ...evaDiagrams.map(d => ({ ...d, user_id: users[4].id }))
      ];

      // Insert each diagram individually
      allDiagrams.forEach(diagram => {
        this.db.run(
          'INSERT INTO diagrams (id, user_id, problem, causes) VALUES (?, ?, ?, ?)',
          [
            uuidv4(),
            diagram.user_id,
            diagram.problem,
            JSON.stringify(diagram.causes)
          ]
        );
      });
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

