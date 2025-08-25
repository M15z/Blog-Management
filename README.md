# Blog Management System  

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Database-Postgres-blue?logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)
![Neon](https://img.shields.io/badge/DB-Neon-green?logo=postgresql)
![Pusher](https://img.shields.io/badge/RealTime-Pusher-purple?logo=pusher)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern full-stack **Next.js blog platform** built for performance, scalability, and learning.  
Originally developed and tested on a **Raspberry Pi 5** with **PostgreSQL** via Prisma, the project is now deployed on **Vercel** with a cloud-native stack.  

---

## 🚀 Features  

- **📝 Blog Management** – Create, edit, and manage blog posts with a clean UI.  
- **🔐 Authentication** – Secure login and session handling.  
- **💾 PostgreSQL Database** – Managed via [Neon](https://neon.tech/) with [Prisma](https://www.prisma.io/) ORM.  
- **📂 Image Uploads** – Stored using [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).  
- **💬 Real-time Private Chat** – Built with [Pusher](https://pusher.com/) for instant communication.  
- **⚡ Fast Deployment** – Hosted on [Vercel](https://vercel.com/).  

---

## 🛠️ Tech Stack  

- **Frontend & Backend:** [Next.js 15](https://nextjs.org/)  
- **Database:** PostgreSQL (Local Pi → Neon Cloud)  
- **ORM:** [Prisma](https://www.prisma.io/)  
- **Hosting:** Vercel  
- **Storage:** Vercel Blob (for images/media)  
- **Real-time Messaging:** Pusher Channels  
- **Dev Environment:** Raspberry Pi 5 (8GB, Arch + Hyprland)  

---

## 📂 Project Structure  

```bash
.
├── app/               # Next.js App Router pages & components
├── components/        # Reusable UI components
├── prisma/            # Prisma schema and migrations
├── public/            # Static assets
├── utils/             # Helper functions
└── README.md          # Project documentation
```

---

## ⚙️ Setup & Installation  

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/blog-management.git
   cd blog-management
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file:  
   ```env
   DATABASE_URL="your-neon-postgres-url"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   PUSHER_APP_ID="your-pusher-app-id"
   PUSHER_KEY="your-pusher-key"
   PUSHER_SECRET="your-pusher-secret"
   PUSHER_CLUSTER="your-pusher-cluster"
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   ```

4. **Run Prisma migrations**  
   ```bash
   npx prisma migrate dev
   ```

5. **Start the dev server**  
   ```bash
   npm run dev
   ```

6. **Visit** → `http://localhost:3000`  

---

## 🌍 Deployment  

The project is live on **Vercel**, fully integrated with:  
- **Neon** for Postgres database hosting  
- **Vercel Blob** for image handling  
- **Pusher** for real-time chat  

---

## 📌 Roadmap  

- [ ] Add user roles (Admin, Writer, Reader)  
- [ ] Rich-text editor for blog posts  
- [ ] Notifications for chat & comments  
- [ ] Dark mode support  

---

## 🤝 Contributing  

Pull requests and suggestions are welcome!  

---

## 📜 License  

MIT License – free to use and modify.  
