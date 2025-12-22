const Article = require('../models/Article');
const Category = require('../models/Category');
const User = require('../models/User');

const seedArticles = async () => {
    try {
        const existingArticles = await Article.countDocuments();
        
        if (existingArticles >= 16) {
            console.log('Articles already seeded');
            return;
        }

        // Get admin user and categories
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin user found. Please create admin first.');
            return;
        }

        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('No categories found. Please seed categories first.');
            return;
        }

        const getCategoryId = (slug) => {
            const cat = categories.find(c => c.slug === slug);
            return cat ? cat._id : categories[0]._id;
        };

        const articlesData = [
            // General Category Articles
            {
                title: 'Getting Started with Our Knowledge Portal',
                slug: 'getting-started-knowledge-portal',
                content: `
                    <h2>Welcome to the Knowledge Portal</h2>
                    <p>This comprehensive guide will help you navigate and make the most of our internal knowledge management system.</p>
                    
                    <h3>What is the Knowledge Portal?</h3>
                    <p>The Knowledge Portal is a centralized platform designed to store, organize, and share organizational knowledge. It serves as a single source of truth for all company documentation, best practices, and institutional knowledge.</p>
                    
                    <h3>Key Features</h3>
                    <ul>
                        <li><strong>Article Management:</strong> Create, edit, and organize articles with rich text formatting</li>
                        <li><strong>Category Organization:</strong> Browse content by departments and topics</li>
                        <li><strong>Search Functionality:</strong> Quickly find information using powerful search</li>
                        <li><strong>Q&A Section:</strong> Ask questions and get answers from colleagues</li>
                        <li><strong>Bookmarks:</strong> Save important articles for quick access</li>
                    </ul>
                    
                    <h3>User Roles</h3>
                    <p>The platform supports different user roles:</p>
                    <ul>
                        <li><strong>Viewer:</strong> Can read articles, bookmark content, and ask questions</li>
                        <li><strong>Contributor:</strong> Can create and edit their own articles</li>
                        <li><strong>Editor:</strong> Can edit any article and manage content</li>
                        <li><strong>Admin:</strong> Full access including user management</li>
                    </ul>
                    
                    <h3>Getting Help</h3>
                    <p>If you need assistance, visit the Support page or reach out to the admin team.</p>
                `,
                tags: ['guide', 'getting-started', 'onboarding', 'help'],
                category: getCategoryId('general'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'A comprehensive guide to help you get started with our Knowledge Portal'
            },
            {
                title: 'Company Communication Guidelines',
                slug: 'company-communication-guidelines',
                content: `
                    <h2>Effective Communication at Work</h2>
                    <p>Clear and effective communication is essential for team success. These guidelines will help ensure professional and productive interactions.</p>
                    
                    <h3>Email Best Practices</h3>
                    <ul>
                        <li>Use clear, descriptive subject lines</li>
                        <li>Keep emails concise and to the point</li>
                        <li>Use bullet points for multiple items</li>
                        <li>Respond within 24-48 hours during business days</li>
                        <li>CC only relevant stakeholders</li>
                    </ul>
                    
                    <h3>Meeting Etiquette</h3>
                    <ul>
                        <li>Always have an agenda before scheduling meetings</li>
                        <li>Start and end meetings on time</li>
                        <li>Take notes and share action items</li>
                        <li>Minimize distractions during meetings</li>
                        <li>Follow up on commitments made during meetings</li>
                    </ul>
                    
                    <h3>Slack/Chat Communication</h3>
                    <ul>
                        <li>Use appropriate channels for topics</li>
                        <li>Use threads for detailed discussions</li>
                        <li>Avoid excessive use of @channel or @here</li>
                        <li>Set status when unavailable</li>
                    </ul>
                    
                    <h3>Documentation</h3>
                    <p>Always document important decisions and processes in this Knowledge Portal for future reference.</p>
                `,
                tags: ['communication', 'guidelines', 'email', 'meetings'],
                category: getCategoryId('general'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Guidelines for effective workplace communication'
            },
            {
                title: 'Remote Work Best Practices',
                slug: 'remote-work-best-practices',
                content: `
                    <h2>Succeeding in a Remote Work Environment</h2>
                    <p>Working remotely requires discipline, good communication, and the right tools. Here's how to stay productive and connected.</p>
                    
                    <h3>Setting Up Your Workspace</h3>
                    <ul>
                        <li>Designate a quiet, dedicated workspace</li>
                        <li>Ensure good lighting and ergonomic setup</li>
                        <li>Test your internet connection speed (minimum 25 Mbps recommended)</li>
                        <li>Have backup connectivity options (mobile hotspot)</li>
                    </ul>
                    
                    <h3>Daily Routine</h3>
                    <ul>
                        <li>Maintain regular working hours</li>
                        <li>Start with a morning standup or check-in</li>
                        <li>Take regular breaks (Pomodoro technique recommended)</li>
                        <li>Set boundaries between work and personal time</li>
                    </ul>
                    
                    <h3>Communication</h3>
                    <ul>
                        <li>Over-communicate rather than under-communicate</li>
                        <li>Use video calls for important discussions</li>
                        <li>Keep calendar up to date with availability</li>
                        <li>Respond promptly to messages during work hours</li>
                    </ul>
                    
                    <h3>Tools We Use</h3>
                    <p>Slack for messaging, Zoom for video calls, Google Workspace for collaboration, and this Knowledge Portal for documentation.</p>
                `,
                tags: ['remote-work', 'wfh', 'productivity', 'tips'],
                category: getCategoryId('general'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Tips and best practices for working remotely'
            },
            {
                title: 'Data Privacy and Security Policy',
                slug: 'data-privacy-security-policy',
                content: `
                    <h2>Protecting Company and Customer Data</h2>
                    <p>Data security is everyone's responsibility. Follow these guidelines to protect sensitive information.</p>
                    
                    <h3>Password Security</h3>
                    <ul>
                        <li>Use strong passwords (minimum 12 characters)</li>
                        <li>Enable two-factor authentication (2FA) on all accounts</li>
                        <li>Never share passwords or store them in plain text</li>
                        <li>Use a password manager (LastPass, 1Password recommended)</li>
                        <li>Change passwords immediately if compromised</li>
                    </ul>
                    
                    <h3>Data Handling</h3>
                    <ul>
                        <li>Only access data necessary for your role</li>
                        <li>Never share customer data externally</li>
                        <li>Encrypt sensitive files before sharing</li>
                        <li>Use approved cloud storage only (Google Drive, OneDrive)</li>
                        <li>Report any data breaches immediately</li>
                    </ul>
                    
                    <h3>Device Security</h3>
                    <ul>
                        <li>Keep devices updated with latest security patches</li>
                        <li>Use company-approved antivirus software</li>
                        <li>Lock devices when away from desk</li>
                        <li>Avoid public WiFi for sensitive work</li>
                    </ul>
                    
                    <h3>Reporting Incidents</h3>
                    <p>Report any security incidents to security@company.com immediately.</p>
                `,
                tags: ['security', 'privacy', 'data-protection', 'policy'],
                category: getCategoryId('general'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Company data privacy and security guidelines'
            },

            // Engineering Category Articles
            {
                title: 'Git Version Control Best Practices',
                slug: 'git-version-control-best-practices',
                content: `
                    <h2>Mastering Git for Team Collaboration</h2>
                    <p>Git is our version control system of choice. Follow these practices for smooth collaboration.</p>
                    
                    <h3>Branch Naming Conventions</h3>
                    <pre><code>feature/feature-name
bugfix/bug-description
hotfix/urgent-fix
release/v1.0.0</code></pre>
                    
                    <h3>Commit Message Format</h3>
                    <pre><code>type(scope): description

[optional body]

[optional footer]</code></pre>
                    <p>Types: feat, fix, docs, style, refactor, test, chore</p>
                    
                    <h3>Workflow</h3>
                    <ol>
                        <li>Create feature branch from develop</li>
                        <li>Make small, focused commits</li>
                        <li>Push regularly to remote</li>
                        <li>Create Pull Request when ready</li>
                        <li>Address code review feedback</li>
                        <li>Merge after approval</li>
                    </ol>
                    
                    <h3>Common Commands</h3>
                    <pre><code>git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
git pull --rebase origin develop</code></pre>
                    
                    <h3>Tips</h3>
                    <ul>
                        <li>Never commit directly to main or develop</li>
                        <li>Rebase feature branches regularly</li>
                        <li>Use meaningful commit messages</li>
                        <li>Review your diff before committing</li>
                    </ul>
                `,
                tags: ['git', 'version-control', 'development', 'workflow'],
                category: getCategoryId('engineering'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Best practices for using Git in team environments'
            },
            {
                title: 'REST API Design Standards',
                slug: 'rest-api-design-standards',
                content: `
                    <h2>Building Consistent and Scalable APIs</h2>
                    <p>Follow these standards to create APIs that are easy to use and maintain.</p>
                    
                    <h3>URL Structure</h3>
                    <pre><code>GET    /api/v1/users          - List users
GET    /api/v1/users/:id      - Get single user
POST   /api/v1/users          - Create user
PUT    /api/v1/users/:id      - Update user
DELETE /api/v1/users/:id      - Delete user</code></pre>
                    
                    <h3>HTTP Status Codes</h3>
                    <ul>
                        <li><strong>200 OK:</strong> Successful GET, PUT</li>
                        <li><strong>201 Created:</strong> Successful POST</li>
                        <li><strong>204 No Content:</strong> Successful DELETE</li>
                        <li><strong>400 Bad Request:</strong> Invalid request data</li>
                        <li><strong>401 Unauthorized:</strong> Authentication required</li>
                        <li><strong>403 Forbidden:</strong> Insufficient permissions</li>
                        <li><strong>404 Not Found:</strong> Resource doesn't exist</li>
                        <li><strong>500 Internal Error:</strong> Server error</li>
                    </ul>
                    
                    <h3>Response Format</h3>
                    <pre><code>{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}</code></pre>
                    
                    <h3>Error Response</h3>
                    <pre><code>{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required"
  }
}</code></pre>
                    
                    <h3>Best Practices</h3>
                    <ul>
                        <li>Use nouns for resources, not verbs</li>
                        <li>Version your APIs</li>
                        <li>Implement pagination for list endpoints</li>
                        <li>Use proper authentication (JWT recommended)</li>
                    </ul>
                `,
                tags: ['api', 'rest', 'backend', 'standards'],
                category: getCategoryId('engineering'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Standards for designing RESTful APIs'
            },
            {
                title: 'Code Review Guidelines',
                slug: 'code-review-guidelines',
                content: `
                    <h2>Effective Code Review Process</h2>
                    <p>Code reviews improve code quality and help spread knowledge. Here's how to do them effectively.</p>
                    
                    <h3>For Authors</h3>
                    <ul>
                        <li>Keep PRs small and focused (under 400 lines ideally)</li>
                        <li>Write clear PR descriptions explaining the changes</li>
                        <li>Self-review before requesting review</li>
                        <li>Include tests for new functionality</li>
                        <li>Link related issues or tickets</li>
                        <li>Respond to feedback promptly</li>
                    </ul>
                    
                    <h3>For Reviewers</h3>
                    <ul>
                        <li>Review within 24 hours</li>
                        <li>Be constructive and respectful</li>
                        <li>Focus on logic, not style (use linters for that)</li>
                        <li>Ask questions if something is unclear</li>
                        <li>Approve when satisfied, don't nitpick</li>
                    </ul>
                    
                    <h3>What to Look For</h3>
                    <ul>
                        <li><strong>Logic:</strong> Does the code do what it should?</li>
                        <li><strong>Security:</strong> Any vulnerabilities?</li>
                        <li><strong>Performance:</strong> Any obvious bottlenecks?</li>
                        <li><strong>Readability:</strong> Is it easy to understand?</li>
                        <li><strong>Tests:</strong> Are important paths tested?</li>
                    </ul>
                    
                    <h3>Comment Guidelines</h3>
                    <p>Use prefixes to indicate severity:</p>
                    <ul>
                        <li><strong>blocker:</strong> Must be fixed before merge</li>
                        <li><strong>suggestion:</strong> Nice to have improvement</li>
                        <li><strong>question:</strong> Need clarification</li>
                        <li><strong>nit:</strong> Minor style issue</li>
                    </ul>
                `,
                tags: ['code-review', 'pull-request', 'best-practices', 'development'],
                category: getCategoryId('engineering'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Guidelines for effective code reviews'
            },
            {
                title: 'Database Design Principles',
                slug: 'database-design-principles',
                content: `
                    <h2>Building Efficient and Scalable Databases</h2>
                    <p>Good database design is crucial for application performance and maintainability.</p>
                    
                    <h3>Normalization</h3>
                    <p>Follow normalization rules to reduce data redundancy:</p>
                    <ul>
                        <li><strong>1NF:</strong> Eliminate repeating groups</li>
                        <li><strong>2NF:</strong> Remove partial dependencies</li>
                        <li><strong>3NF:</strong> Remove transitive dependencies</li>
                    </ul>
                    
                    <h3>Naming Conventions</h3>
                    <ul>
                        <li>Use snake_case for table and column names</li>
                        <li>Use plural names for tables (users, orders)</li>
                        <li>Use singular for column names (user_id, created_at)</li>
                        <li>Prefix foreign keys with referenced table</li>
                    </ul>
                    
                    <h3>Indexing Strategy</h3>
                    <ul>
                        <li>Index columns used in WHERE clauses</li>
                        <li>Index foreign key columns</li>
                        <li>Use composite indexes for multi-column queries</li>
                        <li>Avoid over-indexing (impacts write performance)</li>
                    </ul>
                    
                    <h3>MongoDB Best Practices</h3>
                    <ul>
                        <li>Design for your query patterns</li>
                        <li>Embed related data when queries need it together</li>
                        <li>Use references for large or frequently updated data</li>
                        <li>Index fields used in queries</li>
                    </ul>
                    
                    <h3>Common Patterns</h3>
                    <pre><code>// Soft delete
deleted_at: { type: Date, default: null }

// Timestamps
created_at: { type: Date, default: Date.now }
updated_at: { type: Date, default: Date.now }</code></pre>
                `,
                tags: ['database', 'mongodb', 'sql', 'design-patterns'],
                category: getCategoryId('engineering'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Principles for effective database design'
            },

            // Human Resources Category Articles
            {
                title: 'Employee Onboarding Checklist',
                slug: 'employee-onboarding-checklist',
                content: `
                    <h2>Welcome to the Team!</h2>
                    <p>This checklist will help new employees get set up during their first week.</p>
                    
                    <h3>Day 1 - Getting Started</h3>
                    <ul>
                        <li>☐ Complete HR paperwork</li>
                        <li>☐ Set up company email account</li>
                        <li>☐ Get access badge and office tour</li>
                        <li>☐ Meet with manager for role overview</li>
                        <li>☐ Set up computer and required software</li>
                        <li>☐ Join Slack and introduce yourself</li>
                    </ul>
                    
                    <h3>Week 1 - Learning the Ropes</h3>
                    <ul>
                        <li>☐ Complete compliance training modules</li>
                        <li>☐ Read company handbook and policies</li>
                        <li>☐ Meet with team members one-on-one</li>
                        <li>☐ Set up development environment (if applicable)</li>
                        <li>☐ Review current projects and documentation</li>
                        <li>☐ Set up benefits enrollment</li>
                    </ul>
                    
                    <h3>First Month Goals</h3>
                    <ul>
                        <li>☐ Complete all mandatory training</li>
                        <li>☐ Attend team meetings and standups</li>
                        <li>☐ Complete first small project or task</li>
                        <li>☐ 30-day check-in with manager</li>
                        <li>☐ Connect with mentor or buddy</li>
                    </ul>
                    
                    <h3>Resources</h3>
                    <ul>
                        <li>IT Support: it@company.com</li>
                        <li>HR Questions: hr@company.com</li>
                        <li>Facilities: facilities@company.com</li>
                    </ul>
                `,
                tags: ['onboarding', 'new-employee', 'hr', 'checklist'],
                category: getCategoryId('hr'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Complete onboarding checklist for new employees'
            },
            {
                title: 'Leave and Time-Off Policy',
                slug: 'leave-time-off-policy',
                content: `
                    <h2>Understanding Your Time-Off Benefits</h2>
                    <p>Our leave policy is designed to support work-life balance while ensuring business continuity.</p>
                    
                    <h3>Paid Time Off (PTO)</h3>
                    <ul>
                        <li><strong>Years 0-2:</strong> 15 days per year</li>
                        <li><strong>Years 3-5:</strong> 20 days per year</li>
                        <li><strong>Years 5+:</strong> 25 days per year</li>
                    </ul>
                    <p>PTO accrues monthly and can be carried over (max 5 days).</p>
                    
                    <h3>Sick Leave</h3>
                    <ul>
                        <li>10 paid sick days per year</li>
                        <li>No documentation required for 1-2 days</li>
                        <li>Doctor's note required for 3+ consecutive days</li>
                        <li>Can be used for self or family care</li>
                    </ul>
                    
                    <h3>Holidays</h3>
                    <p>We observe 10 company holidays plus 2 floating holidays of your choice.</p>
                    
                    <h3>Other Leave Types</h3>
                    <ul>
                        <li><strong>Parental Leave:</strong> 12 weeks paid</li>
                        <li><strong>Bereavement:</strong> 5 days for immediate family</li>
                        <li><strong>Jury Duty:</strong> Paid time as required</li>
                        <li><strong>Sabbatical:</strong> 4 weeks after 5 years</li>
                    </ul>
                    
                    <h3>Requesting Time Off</h3>
                    <ol>
                        <li>Submit request in HR system at least 2 weeks in advance</li>
                        <li>Get manager approval</li>
                        <li>Ensure coverage for responsibilities</li>
                        <li>Set out-of-office message</li>
                    </ol>
                `,
                tags: ['leave', 'pto', 'vacation', 'policy', 'hr'],
                category: getCategoryId('hr'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Company leave and time-off policies'
            },
            {
                title: 'Performance Review Process',
                slug: 'performance-review-process',
                content: `
                    <h2>Understanding Performance Reviews</h2>
                    <p>Performance reviews help us grow professionally and align on goals.</p>
                    
                    <h3>Review Cycle</h3>
                    <ul>
                        <li><strong>Quarterly:</strong> Goal check-ins with manager</li>
                        <li><strong>Semi-Annual:</strong> Mid-year review (June)</li>
                        <li><strong>Annual:</strong> Full performance review (December)</li>
                    </ul>
                    
                    <h3>Self-Assessment</h3>
                    <p>Before each review, complete a self-assessment covering:</p>
                    <ul>
                        <li>Accomplishments since last review</li>
                        <li>Areas of growth and improvement</li>
                        <li>Goals for next period</li>
                        <li>Career development interests</li>
                        <li>Feedback on team and processes</li>
                    </ul>
                    
                    <h3>Rating Scale</h3>
                    <ul>
                        <li><strong>5 - Exceptional:</strong> Consistently exceeds expectations</li>
                        <li><strong>4 - Exceeds:</strong> Often exceeds expectations</li>
                        <li><strong>3 - Meets:</strong> Consistently meets expectations</li>
                        <li><strong>2 - Needs Improvement:</strong> Sometimes falls short</li>
                        <li><strong>1 - Unsatisfactory:</strong> Does not meet expectations</li>
                    </ul>
                    
                    <h3>Goal Setting (SMART)</h3>
                    <ul>
                        <li><strong>Specific:</strong> Clear and well-defined</li>
                        <li><strong>Measurable:</strong> Quantifiable metrics</li>
                        <li><strong>Achievable:</strong> Realistic and attainable</li>
                        <li><strong>Relevant:</strong> Aligned with team goals</li>
                        <li><strong>Time-bound:</strong> Clear deadline</li>
                    </ul>
                    
                    <h3>Compensation Review</h3>
                    <p>Annual reviews may include merit increases based on performance, market adjustments, and company performance.</p>
                `,
                tags: ['performance', 'review', 'goals', 'hr', 'career'],
                category: getCategoryId('hr'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Guide to the performance review process'
            },
            {
                title: 'Benefits and Compensation Overview',
                slug: 'benefits-compensation-overview',
                content: `
                    <h2>Your Total Rewards Package</h2>
                    <p>We offer competitive compensation and comprehensive benefits to support your well-being.</p>
                    
                    <h3>Health Insurance</h3>
                    <ul>
                        <li>Medical: PPO and HDHP options</li>
                        <li>Dental: Preventive care 100% covered</li>
                        <li>Vision: Annual exam and allowance for glasses/contacts</li>
                        <li>Company pays 80% of premiums</li>
                    </ul>
                    
                    <h3>Financial Benefits</h3>
                    <ul>
                        <li><strong>401(k):</strong> 4% company match, immediate vesting</li>
                        <li><strong>Life Insurance:</strong> 2x salary (company paid)</li>
                        <li><strong>Disability:</strong> Short and long-term coverage</li>
                        <li><strong>HSA/FSA:</strong> Pre-tax healthcare savings</li>
                        <li><strong>Stock Options:</strong> Equity grants for eligible employees</li>
                    </ul>
                    
                    <h3>Wellness Benefits</h3>
                    <ul>
                        <li>Gym membership reimbursement ($50/month)</li>
                        <li>Mental health support (free counseling sessions)</li>
                        <li>Wellness program with incentives</li>
                        <li>Ergonomic equipment stipend</li>
                    </ul>
                    
                    <h3>Professional Development</h3>
                    <ul>
                        <li>$2,000 annual learning budget</li>
                        <li>Conference attendance opportunities</li>
                        <li>Internal training programs</li>
                        <li>Tuition reimbursement program</li>
                    </ul>
                    
                    <h3>Perks</h3>
                    <ul>
                        <li>Remote work flexibility</li>
                        <li>Commuter benefits</li>
                        <li>Free snacks and beverages</li>
                        <li>Team events and outings</li>
                    </ul>
                `,
                tags: ['benefits', 'compensation', 'insurance', 'hr', '401k'],
                category: getCategoryId('hr'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Overview of company benefits and compensation'
            },

            // Marketing Category Articles
            {
                title: 'Brand Guidelines and Identity',
                slug: 'brand-guidelines-identity',
                content: `
                    <h2>Our Brand Identity</h2>
                    <p>Consistent branding builds recognition and trust. Follow these guidelines in all communications.</p>
                    
                    <h3>Logo Usage</h3>
                    <ul>
                        <li>Always use approved logo files from the brand kit</li>
                        <li>Maintain clear space around the logo (minimum 20px)</li>
                        <li>Don't stretch, rotate, or alter the logo</li>
                        <li>Use appropriate logo version for background color</li>
                    </ul>
                    
                    <h3>Color Palette</h3>
                    <ul>
                        <li><strong>Primary Blue:</strong> #3B82F6 - Use for CTAs and highlights</li>
                        <li><strong>Dark Blue:</strong> #1E3A8A - Use for headers</li>
                        <li><strong>Gray:</strong> #64748B - Use for body text</li>
                        <li><strong>Light Gray:</strong> #F1F5F9 - Use for backgrounds</li>
                        <li><strong>Success Green:</strong> #10B981</li>
                        <li><strong>Warning Orange:</strong> #F59E0B</li>
                    </ul>
                    
                    <h3>Typography</h3>
                    <ul>
                        <li><strong>Headings:</strong> Inter (Bold, Semi-bold)</li>
                        <li><strong>Body:</strong> Inter (Regular, Medium)</li>
                        <li><strong>Code:</strong> Fira Code (Monospace)</li>
                    </ul>
                    
                    <h3>Voice and Tone</h3>
                    <ul>
                        <li><strong>Professional</strong> but approachable</li>
                        <li><strong>Clear</strong> and concise</li>
                        <li><strong>Helpful</strong> and supportive</li>
                        <li><strong>Confident</strong> without being arrogant</li>
                    </ul>
                    
                    <h3>Brand Assets</h3>
                    <p>Download official brand assets from the shared drive: Marketing/Brand-Kit/</p>
                `,
                tags: ['brand', 'design', 'logo', 'guidelines', 'identity'],
                category: getCategoryId('marketing'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Official brand guidelines and identity standards'
            },
            {
                title: 'Social Media Strategy',
                slug: 'social-media-strategy',
                content: `
                    <h2>Building Our Social Media Presence</h2>
                    <p>Social media is key to reaching our audience. Here's our strategy and guidelines.</p>
                    
                    <h3>Platforms</h3>
                    <ul>
                        <li><strong>LinkedIn:</strong> Professional content, company updates, thought leadership</li>
                        <li><strong>Twitter/X:</strong> Industry news, quick updates, engagement</li>
                        <li><strong>Instagram:</strong> Culture, behind-the-scenes, visual content</li>
                        <li><strong>YouTube:</strong> Tutorials, webinars, product demos</li>
                    </ul>
                    
                    <h3>Content Pillars</h3>
                    <ul>
                        <li><strong>Educational:</strong> Tips, tutorials, industry insights (40%)</li>
                        <li><strong>Company Culture:</strong> Team spotlights, events (20%)</li>
                        <li><strong>Product:</strong> Features, updates, use cases (25%)</li>
                        <li><strong>Engagement:</strong> Questions, polls, user content (15%)</li>
                    </ul>
                    
                    <h3>Posting Schedule</h3>
                    <ul>
                        <li>LinkedIn: 3-5 times per week</li>
                        <li>Twitter: 1-2 times daily</li>
                        <li>Instagram: 3-4 times per week</li>
                    </ul>
                    
                    <h3>Best Practices</h3>
                    <ul>
                        <li>Use branded hashtags consistently</li>
                        <li>Respond to comments within 24 hours</li>
                        <li>Include visuals in every post</li>
                        <li>Tag relevant people and companies</li>
                        <li>Track metrics and adjust strategy</li>
                    </ul>
                    
                    <h3>Do's and Don'ts</h3>
                    <p><strong>Do:</strong> Be authentic, engage with followers, share valuable content</p>
                    <p><strong>Don't:</strong> Engage in controversial topics, share confidential info, ignore negative feedback</p>
                `,
                tags: ['social-media', 'marketing', 'strategy', 'content'],
                category: getCategoryId('marketing'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Social media strategy and guidelines'
            },
            {
                title: 'Content Marketing Playbook',
                slug: 'content-marketing-playbook',
                content: `
                    <h2>Creating Content That Converts</h2>
                    <p>Quality content drives traffic, builds trust, and generates leads. Here's how we do it.</p>
                    
                    <h3>Content Types</h3>
                    <ul>
                        <li><strong>Blog Posts:</strong> SEO-optimized articles (1000-2000 words)</li>
                        <li><strong>Whitepapers:</strong> In-depth research and guides</li>
                        <li><strong>Case Studies:</strong> Customer success stories</li>
                        <li><strong>Ebooks:</strong> Comprehensive guides for lead gen</li>
                        <li><strong>Videos:</strong> Tutorials, demos, webinars</li>
                        <li><strong>Infographics:</strong> Visual data and concepts</li>
                    </ul>
                    
                    <h3>SEO Best Practices</h3>
                    <ul>
                        <li>Research keywords before writing</li>
                        <li>Include primary keyword in title and H1</li>
                        <li>Use related keywords naturally</li>
                        <li>Write compelling meta descriptions</li>
                        <li>Include internal and external links</li>
                        <li>Optimize images with alt text</li>
                    </ul>
                    
                    <h3>Content Calendar</h3>
                    <ul>
                        <li>Plan content 1-2 months ahead</li>
                        <li>Align with product launches and events</li>
                        <li>Mix evergreen and timely content</li>
                        <li>Review and update calendar weekly</li>
                    </ul>
                    
                    <h3>Distribution Channels</h3>
                    <ul>
                        <li>Company blog</li>
                        <li>Email newsletter</li>
                        <li>Social media</li>
                        <li>Industry publications</li>
                        <li>Partner channels</li>
                    </ul>
                    
                    <h3>Metrics to Track</h3>
                    <ul>
                        <li>Page views and unique visitors</li>
                        <li>Time on page</li>
                        <li>Conversion rates</li>
                        <li>Social shares</li>
                        <li>Backlinks acquired</li>
                    </ul>
                `,
                tags: ['content-marketing', 'seo', 'blog', 'strategy'],
                category: getCategoryId('marketing'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Complete content marketing strategy guide'
            },
            {
                title: 'Email Marketing Best Practices',
                slug: 'email-marketing-best-practices',
                content: `
                    <h2>Effective Email Campaigns</h2>
                    <p>Email remains one of the highest ROI marketing channels. Here's how to do it right.</p>
                    
                    <h3>Email Types</h3>
                    <ul>
                        <li><strong>Newsletter:</strong> Weekly/monthly updates and content</li>
                        <li><strong>Promotional:</strong> Special offers and announcements</li>
                        <li><strong>Nurture:</strong> Automated sequences for leads</li>
                        <li><strong>Transactional:</strong> Receipts, confirmations, updates</li>
                        <li><strong>Re-engagement:</strong> Win back inactive subscribers</li>
                    </ul>
                    
                    <h3>Subject Line Tips</h3>
                    <ul>
                        <li>Keep it under 50 characters</li>
                        <li>Create urgency or curiosity</li>
                        <li>Personalize when possible</li>
                        <li>Avoid spam trigger words</li>
                        <li>A/B test different approaches</li>
                    </ul>
                    
                    <h3>Design Guidelines</h3>
                    <ul>
                        <li>Use responsive templates</li>
                        <li>Keep main content above the fold</li>
                        <li>Use clear CTAs (one primary)</li>
                        <li>Maintain brand consistency</li>
                        <li>Optimize images for fast loading</li>
                    </ul>
                    
                    <h3>Sending Best Practices</h3>
                    <ul>
                        <li>Best times: Tue-Thu, 10am or 2pm</li>
                        <li>Segment your lists for relevance</li>
                        <li>Clean list regularly (remove bounces)</li>
                        <li>Include unsubscribe link (required)</li>
                        <li>Test emails before sending</li>
                    </ul>
                    
                    <h3>Key Metrics</h3>
                    <ul>
                        <li><strong>Open Rate:</strong> Target 20-25%</li>
                        <li><strong>Click Rate:</strong> Target 2-5%</li>
                        <li><strong>Unsubscribe Rate:</strong> Keep under 0.5%</li>
                        <li><strong>Conversion Rate:</strong> Track by campaign type</li>
                    </ul>
                `,
                tags: ['email', 'marketing', 'newsletter', 'campaigns'],
                category: getCategoryId('marketing'),
                author: admin._id,
                status: 'published',
                visibility: 'public',
                description: 'Best practices for email marketing campaigns'
            }
        ];

        // Clear existing articles first (optional - remove if you want to keep existing)
        // await Article.deleteMany();

        await Article.insertMany(articlesData);
        console.log('✅ Articles seeded successfully! (16 articles across 4 categories)');

    } catch (error) {
        console.error('Error seeding articles:', error.message);
    }
};

module.exports = { seedArticles };
