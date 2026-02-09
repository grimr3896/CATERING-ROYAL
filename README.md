# Savie Catering Website

A modern, production-ready catering website built with Next.js and Supabase, designed for fast performance, easy content management, and scalable deployment on Vercel. The site uses a Controller (admin-style page) to manage all content, while public pages automatically reflect updates in real time.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend / Database:** Supabase (PostgreSQL + Storage)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS
- **Data Access:** Supabase public read (no authentication required)

## 🧠 How the Project Works

### Public Pages

The website includes the following public-facing pages:

- **Home** - Landing page with hero section and key services
- **Gallery** - Photo gallery of catering events and dishes
- **About** - Information about the catering business and team
- **Contact** - Contact form and business information

**Key Features:**
- Read data directly from Supabase
- Require no login or authentication
- Automatically update when content changes in Supabase
- Fall back to hardcoded data if tables are empty

### Controller Page

The Controller acts as a lightweight CMS (Content Management System).

**Capabilities:**
- Create, update, and delete content
- Upload images to Supabase Storage
- Manage all site content including:
  - Services
  - Gallery items
  - Testimonials
  - Team members
  - Social links
  - Site content (hero text, about section, etc.)

**Key Behavior:**
- Writes data to Supabase tables
- Uploads images to Supabase Storage
- Changes appear instantly on public pages
- No authentication (intended for controlled/private use)

## 🗄️ Supabase Structure

### Database Tables

The project uses **6 tables**:

1. `services` - Catering services offered
2. `gallery_items` - Gallery photos and descriptions
3. `testimonials` - Customer reviews and feedback
4. `team_members` - Staff and team information
5. `social_links` - Social media links
6. `site_content` - General site content (hero text, about section, etc.)

**Security Settings:**
- All tables have Row Level Security (RLS) enabled
- Public read policies are configured (production-safe)
- Accessed using the Supabase anon key

### Storage Buckets

Used for image uploads:

- `hero-images` - Hero section images
- `services` - Service-related images
- `gallery` - Gallery photos
- `team-photos` - Team member photos

All uploaded images generate public URLs that are stored in the database.

## 🔐 Security Model

- **Public read-only access** for frontend pages
- **No authentication** required for viewing content
- **Write operations** performed only via the Controller
- Intended for:
  - Static marketing sites
  - Controlled admin usage
  - CMS-style workflows

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account and project
- A Vercel account (for deployment)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd savie-catering-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase:**
   
   - Create the required tables in your Supabase project
   - Set up Row Level Security policies for public read access
   - Create the storage buckets listed above
   - Configure bucket permissions for public access

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy!

The site will automatically deploy on every push to your main branch.

## 📁 Project Structure

```
savie-catering-website/
├── app/
│   ├── page.js              # Home page
│   ├── gallery/             # Gallery page
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   └── controller/          # Admin controller page
├── components/              # Reusable React components
├── lib/
│   └── supabase.js         # Supabase client configuration
├── public/                  # Static assets
├── styles/                  # Global styles
└── .env.local              # Environment variables (create this)
```

## 🎨 Customization

### Modifying Content

Use the Controller page (`/controller`) to:
- Update hero text and images
- Add/edit/delete services
- Manage gallery photos
- Update team member information
- Modify social media links

### Styling

The project uses Tailwind CSS. Customize the design by:
- Editing `tailwind.config.js`
- Modifying component styles in individual files
- Updating global styles in `app/globals.css`

## 🔒 Important Security Notes

⚠️ **Controller Access:**
- The Controller page has no authentication by default
- Consider adding password protection or IP restrictions for production use
- Limit access to trusted users only

⚠️ **Production Recommendations:**
- Implement authentication for the Controller page
- Use environment-specific Supabase projects
- Monitor database usage and set up alerts
- Regularly backup your Supabase database

## 🐛 Troubleshooting

### Images not loading
- Check that storage buckets are set to public
- Verify bucket names match the configuration
- Ensure image URLs are correctly stored in the database

### Data not appearing
- Confirm Supabase environment variables are correct
- Check Row Level Security policies
- Verify tables exist and have data

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript or ESLint errors

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js and Supabase
