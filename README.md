Elearning Platform (React + Node + MySQL) - Scaffold
---------------------------------------------------
What this archive contains:
- backend/       : Node.js (Express) server that uses MySQL
- frontend/      : React (Vite) frontend with Tailwind CSS
- sql/schema.sql : SQL schema to create required tables
- README.md      : This file (brief usage & deployment notes)

IMPORTANT NOTES (please read):
1) This scaffold is a complete starter implementation covering:
   - Admin & Student auth (admin default: amr / 123456)
   - Student registration with auto-generated numeric student_id
   - Admin dashboard skeleton with user management, codes management
   - Video/lecture CRUD with playlists and thumbnail support
   - Upload endpoints with simple chunked upload support (server stores file parts then merges)
   - Exams table and simple endpoints (you'll implement detailed exam UI/business logic)
   - Device & IP capture on login (via request headers and user-agent)
2) InfinityFree & Vercel limitations:
   - InfinityFree often restricts long-running uploads and large file sizes. Uploads up to 9GB will usually NOT work on shared hosts.
   - Vercel serverless functions have size/time limits; it's better to host the backend on a VPS (DigitalOcean, Render, Railway) or use object storage (S3, Backblaze, Cloudflare R2) for large files.
   - This scaffold includes chunked upload logic; for reliable 9GB uploads you MUST use a storage service or a VPS with sufficient disk and timeout settings.
3) How to use:
   - Create a MySQL database on InfinityFree and note host, database name, username, password.
   - Edit backend/.env with your DB credentials and a JWT secret.
   - Run backend:
       npm install
       npm run start
   - Run frontend:
       npm install
       npm run dev
4) Deployment:
   - Frontend can be deployed to Vercel (static site).
   - Backend: deploy to a Node host (Render, Railway, DigitalOcean). If you try Vercel, use serverless functions but expect limits.
5) Security:
   - Change default admin password after first login.
   - Use HTTPS in production.
   - Use strong DB passwords and restrict access.

Files of special interest:
- backend/server.js       : Express server entry
- backend/db.js           : MySQL connection helper (uses mysql2)
- backend/routes/auth.js  : login/register routes for admin & students
- backend/routes/videos.js : video & playlist CRUD, upload endpoints
- sql/schema.sql          : SQL to create tables
- frontend/src/App.jsx    : React Router and main layout
- frontend/src/pages/*    : Page components (Admin, Student, VideoPlayer, Upload)

Limitations of this scaffold:
- This is a scaffold and includes working endpoints and UI but not a polished production-ready UI.
- Upload reliability for multi-gig files depends on hosting & client implementation.
- You should review and harden authentication, permissions, validation, and CORS before production.

If you want, I can:
- Customize the UI styling, produce screenshots, or
- Add an S3-compatible upload flow and full exam UI.
