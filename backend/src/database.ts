import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const dbPath = path.join(__dirname, '../db/fishbone.db');

interface User {
  id: string;
  name: string;
}

interface Cause {
  id: string;
  name: string;
  notes?: string;
  causes: Cause[];
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
              id: uuidv4(),
              name: "Development Process",
              causes: [
                {
                  id: uuidv4(),
                  name: "Code Review",
                  notes: "Lack of thorough code review process",
                  causes: [
                    { id: uuidv4(), name: "Time Pressure", causes: [] },
                    { id: uuidv4(), name: "Insufficient Training", causes: [] }
                  ]
                },
                {
                  id: uuidv4(),
                  name: "Testing",
                  causes: [
                    { id: uuidv4(), name: "Unit Test Coverage", causes: [] },
                    { id: uuidv4(), name: "Integration Testing", causes: [] }
                  ]
                }
              ]
            },
            {
              id: uuidv4(),
              name: "Environment Issues",
              causes: [
                { id: uuidv4(), name: "Configuration Management", causes: [] },
                { id: uuidv4(), name: "Dependency Conflicts", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Team Communication",
              causes: [
                { id: uuidv4(), name: "Documentation", causes: [] },
                { id: uuidv4(), name: "Knowledge Sharing", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Code Quality",
              causes: [
                { id: uuidv4(), name: "Coding Standards", causes: [] },
                { id: uuidv4(), name: "Refactoring Practices", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Slow application performance",
          causes: [
            {
              id: uuidv4(),
              name: "Database Issues",
              causes: [
                { id: uuidv4(), name: "Query Optimization", causes: [] },
                { id: uuidv4(), name: "Index Management", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Frontend Performance",
              causes: [
                { id: uuidv4(), name: "Bundle Size", causes: [] },
                { id: uuidv4(), name: "Rendering Optimization", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Infrastructure",
              causes: [
                { id: uuidv4(), name: "Server Resources", causes: [] },
                { id: uuidv4(), name: "Network Latency", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Caching Strategy",
              causes: [
                { id: uuidv4(), name: "Application Cache", causes: [] },
                { id: uuidv4(), name: "CDN Configuration", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Security vulnerabilities in web application",
          causes: [
            {
              id: uuidv4(),
              name: "Input Validation",
              causes: [
                { id: uuidv4(), name: "SQL Injection Prevention", causes: [] },
                { id: uuidv4(), name: "XSS Protection", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Authentication",
              causes: [
                { id: uuidv4(), name: "Password Policies", causes: [] },
                { id: uuidv4(), name: "Session Management", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Authorization",
              causes: [
                { id: uuidv4(), name: "Role-Based Access", causes: [] },
                { id: uuidv4(), name: "Permission Checks", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Data Protection",
              causes: [
                { id: uuidv4(), name: "Encryption", causes: [] },
                { id: uuidv4(), name: "Data Sanitization", causes: [] }
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
              id: uuidv4(),
              name: "Content Strategy",
              causes: [
                { id: uuidv4(), name: "Content Quality", causes: [] },
                { id: uuidv4(), name: "Posting Frequency", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Audience Targeting",
              causes: [
                { id: uuidv4(), name: "Demographic Analysis", causes: [] },
                { id: uuidv4(), name: "Interest Mapping", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Platform Selection",
              causes: [
                { id: uuidv4(), name: "Channel Effectiveness", causes: [] },
                { id: uuidv4(), name: "Platform Features", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Engagement Tactics",
              causes: [
                { id: uuidv4(), name: "Interactive Content", causes: [] },
                { id: uuidv4(), name: "Community Building", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Poor conversion rates in email campaigns",
          causes: [
            {
              id: uuidv4(),
              name: "Email Design",
              causes: [
                { id: uuidv4(), name: "Visual Appeal", causes: [] },
                { id: uuidv4(), name: "Mobile Optimization", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Subject Lines",
              causes: [
                { id: uuidv4(), name: "Personalization", causes: [] },
                { id: uuidv4(), name: "A/B Testing", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "List Quality",
              causes: [
                { id: uuidv4(), name: "Segmentation", causes: [] },
                { id: uuidv4(), name: "List Hygiene", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Call-to-Action",
              causes: [
                { id: uuidv4(), name: "Button Design", causes: [] },
                { id: uuidv4(), name: "Placement Strategy", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Brand awareness not growing",
          causes: [
            {
              id: uuidv4(),
              name: "Advertising Strategy",
              causes: [
                { id: uuidv4(), name: "Media Mix", causes: [] },
                { id: uuidv4(), name: "Creative Quality", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Public Relations",
              causes: [
                { id: uuidv4(), name: "Press Coverage", causes: [] },
                { id: uuidv4(), name: "Event Participation", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Partnerships",
              causes: [
                { id: uuidv4(), name: "Strategic Alliances", causes: [] },
                { id: uuidv4(), name: "Influencer Marketing", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Content Marketing",
              causes: [
                { id: uuidv4(), name: "SEO Strategy", causes: [] },
                { id: uuidv4(), name: "Thought Leadership", causes: [] }
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
              id: uuidv4(),
              name: "Staffing Issues",
              causes: [
                { id: uuidv4(), name: "Agent Availability", causes: [] },
                { id: uuidv4(), name: "Training Requirements", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Process Efficiency",
              causes: [
                { id: uuidv4(), name: "Workflow Design", causes: [] },
                { id: uuidv4(), name: "Tool Integration", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Technology",
              causes: [
                { id: uuidv4(), name: "System Performance", causes: [] },
                { id: uuidv4(), name: "Automation Level", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Queue Management",
              causes: [
                { id: uuidv4(), name: "Priority System", causes: [] },
                { id: uuidv4(), name: "Routing Logic", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Customer satisfaction scores declining",
          causes: [
            {
              id: uuidv4(),
              name: "Service Quality",
              causes: [
                { id: uuidv4(), name: "Agent Skills", causes: [] },
                { id: uuidv4(), name: "Service Standards", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Communication",
              causes: [
                { id: uuidv4(), name: "Response Clarity", causes: [] },
                { id: uuidv4(), name: "Follow-up Process", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Problem Resolution",
              causes: [
                { id: uuidv4(), name: "First Call Resolution", causes: [] },
                { id: uuidv4(), name: "Escalation Process", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Customer Experience",
              causes: [
                { id: uuidv4(), name: "Touchpoint Design", causes: [] },
                { id: uuidv4(), name: "Personalization", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "High customer churn rate",
          causes: [
            {
              id: uuidv4(),
              name: "Product Issues",
              causes: [
                { id: uuidv4(), name: "Feature Gaps", causes: [] },
                { id: uuidv4(), name: "Reliability Problems", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Competition",
              causes: [
                { id: uuidv4(), name: "Market Position", causes: [] },
                { id: uuidv4(), name: "Pricing Strategy", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Customer Support",
              causes: [
                { id: uuidv4(), name: "Response Time", causes: [] },
                { id: uuidv4(), name: "Support Quality", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Value Proposition",
              causes: [
                { id: uuidv4(), name: "ROI Demonstration", causes: [] },
                { id: uuidv4(), name: "Feature Benefits", causes: [] }
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
              id: uuidv4(),
              name: "Raw Materials",
              causes: [
                { id: uuidv4(), name: "Supplier Quality", causes: [] },
                { id: uuidv4(), name: "Material Testing", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Production Process",
              causes: [
                { id: uuidv4(), name: "Equipment Calibration", causes: [] },
                { id: uuidv4(), name: "Process Parameters", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Human Factors",
              causes: [
                { id: uuidv4(), name: "Operator Training", causes: [] },
                { id: uuidv4(), name: "Work Procedures", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Quality Control",
              causes: [
                { id: uuidv4(), name: "Inspection Process", causes: [] },
                { id: uuidv4(), name: "Testing Methods", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Production delays and missed deadlines",
          causes: [
            {
              id: uuidv4(),
              name: "Equipment Issues",
              causes: [
                { id: uuidv4(), name: "Maintenance Schedule", causes: [] },
                { id: uuidv4(), name: "Breakdown Frequency", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Supply Chain",
              causes: [
                { id: uuidv4(), name: "Vendor Reliability", causes: [] },
                { id: uuidv4(), name: "Inventory Management", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Workforce",
              causes: [
                { id: uuidv4(), name: "Staffing Levels", causes: [] },
                { id: uuidv4(), name: "Skill Availability", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Planning",
              causes: [
                { id: uuidv4(), name: "Production Scheduling", causes: [] },
                { id: uuidv4(), name: "Capacity Planning", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "High production costs",
          causes: [
            {
              id: uuidv4(),
              name: "Energy Usage",
              causes: [
                { id: uuidv4(), name: "Equipment Efficiency", causes: [] },
                { id: uuidv4(), name: "Process Optimization", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Labor Costs",
              causes: [
                { id: uuidv4(), name: "Productivity Levels", causes: [] },
                { id: uuidv4(), name: "Overtime Usage", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Waste Management",
              causes: [
                { id: uuidv4(), name: "Scrap Reduction", causes: [] },
                { id: uuidv4(), name: "Recycling Programs", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Overhead",
              causes: [
                { id: uuidv4(), name: "Facility Costs", causes: [] },
                { id: uuidv4(), name: "Administrative Expenses", causes: [] }
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
              id: uuidv4(),
              name: "Staffing",
              causes: [
                { id: uuidv4(), name: "Nurse Availability", causes: [] },
                { id: uuidv4(), name: "Doctor Schedules", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Process Flow",
              causes: [
                { id: uuidv4(), name: "Registration Process", causes: [] },
                { id: uuidv4(), name: "Triage System", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Facility",
              causes: [
                { id: uuidv4(), name: "Room Availability", causes: [] },
                { id: uuidv4(), name: "Equipment Access", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Communication",
              causes: [
                { id: uuidv4(), name: "Patient Updates", causes: [] },
                { id: uuidv4(), name: "Staff Coordination", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Medical errors occurring",
          causes: [
            {
              id: uuidv4(),
              name: "Medication Management",
              causes: [
                { id: uuidv4(), name: "Prescription Process", causes: [] },
                { id: uuidv4(), name: "Dosage Verification", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Documentation",
              causes: [
                { id: uuidv4(), name: "Chart Accuracy", causes: [] },
                { id: uuidv4(), name: "Information Transfer", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Training",
              causes: [
                { id: uuidv4(), name: "Clinical Skills", causes: [] },
                { id: uuidv4(), name: "Safety Protocols", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "System Design",
              causes: [
                { id: uuidv4(), name: "Error Prevention", causes: [] },
                { id: uuidv4(), name: "Alert Systems", causes: [] }
              ]
            }
          ]
        },
        {
          problem: "Patient satisfaction declining",
          causes: [
            {
              id: uuidv4(),
              name: "Care Quality",
              causes: [
                { id: uuidv4(), name: "Treatment Effectiveness", causes: [] },
                { id: uuidv4(), name: "Outcome Management", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Patient Experience",
              causes: [
                { id: uuidv4(), name: "Comfort Measures", causes: [] },
                { id: uuidv4(), name: "Environment Quality", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Communication",
              causes: [
                { id: uuidv4(), name: "Doctor-Patient Interaction", causes: [] },
                { id: uuidv4(), name: "Information Sharing", causes: [] }
              ]
            },
            {
              id: uuidv4(),
              name: "Accessibility",
              causes: [
                { id: uuidv4(), name: "Appointment Availability", causes: [] },
                { id: uuidv4(), name: "Location Convenience", causes: [] }
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

  public getDiagramById(diagramId: string): Promise<Diagram | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM diagrams WHERE id = ?',
        [diagramId],
        (err, row: Diagram) => {
          if (err) reject(err);
          else resolve(row || null);
        }
      );
    });
  }

  public updateDiagram(userId: string, diagramId: string, problem: string, causes: object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE diagrams SET problem = ?, causes = ? WHERE user_id = ? AND id = ?',
        [problem, JSON.stringify(causes), userId, diagramId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  public updateDiagramById(diagramId: string, problem: string, causes: object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE diagrams SET problem = ?, causes = ? WHERE id = ?',
        [problem, JSON.stringify(causes), diagramId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  public deleteDiagramById(diagramId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM diagrams WHERE id = ?',
        [diagramId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  }

  public createDiagram(userId: string, problem: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const diagramId = uuidv4();
      
      // Initialize with predefined top-level causes
      const predefinedCauses: Cause[] = [
        {
          id: uuidv4(),
          name: "Materials",
          notes: "Issues related to materials, supplies, or resources",
          causes: []
        },
        {
          id: uuidv4(),
          name: "Measurement",
          notes: "Issues related to measurement, monitoring, or data collection",
          causes: []
        },
        {
          id: uuidv4(),
          name: "Environment",
          notes: "Issues related to environmental factors or conditions",
          causes: []
        },
        {
          id: uuidv4(),
          name: "Method",
          notes: "Issues related to processes, procedures, or methodologies",
          causes: []
        },
        {
          id: uuidv4(),
          name: "Machine",
          notes: "Issues related to equipment, tools, or machinery",
          causes: []
        },
        {
          id: uuidv4(),
          name: "People",
          notes: "Issues related to human factors, skills, or training",
          causes: []
        }
      ];
      
      const initialCauses = JSON.stringify(predefinedCauses);
      
      this.db.run(
        'INSERT INTO diagrams (id, user_id, problem, causes) VALUES (?, ?, ?, ?)',
        [diagramId, userId, problem, initialCauses],
        function(err) {
          if (err) reject(err);
          else resolve(diagramId);
        }
      );
    });
  }

  public close(): void {
    this.db.close();
  }
}

