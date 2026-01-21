# PhishSim - Phishing Simulation Platform

PhishSim is a professional Phishing Simulation as a Service (PaaS) platform designed to help organizations test and improve their security awareness. It allows administrators to create, launch, and track simulated phishing campaigns.

## Features

-   **Campaign Management**: Create and launch phishing campaigns targeting specific user groups.
-   **Email Templates**: Customizable HTML email templates with dynamic tracking links.
-   **Target Groups**: Manage lists of targets via CSV upload.
-   **Real-time Tracking**: Track email opens, link clicks, and compromised credentials (simulated).
-   **Interactive Dashboard**: View campaign statistics and detailed event logs in real-time.
-   **Fake Login Pages**: Realistic login pages to capture "compromised" events (credentials are NOT stored).
-   **Responsive Design**: Modern, dark-mode compatible UI built with Tailwind CSS.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
-   **Authentication**: Supabase Auth
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Email**: [Nodemailer](https://nodemailer.com/) (SMTP)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   A Supabase project
-   An SMTP provider (e.g., Gmail App Password, SendGrid, Resend)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/phishsim.git
    cd phishsim
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    NEXT_PUBLIC_APP_URL=http://localhost:3000

    # SMTP Configuration
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_app_password
    SMTP_FROM="Security Team <security@yourdomain.com>"
    ```

4.  **Database Setup:**
    Run the SQL scripts provided in `supabase/schema.sql` (if available) or manually create the following tables in Supabase:
    -   `campaigns`
    -   `email_templates`
    -   `groups`
    -   `targets`
    -   `events`
    -   `landing_pages`

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

6.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Usage

1.  **Login**: Sign in with your account.
2.  **Create Resources**:
    -   Go to **Templates** to create an email template.
    -   Go to **Groups** to upload a CSV of targets.
3.  **Launch Campaign**:
    -   Go to **Campaigns** -> **New Campaign**.
    -   Select a template and a target group.
    -   Click **Launch**.
4.  **Track Progress**:
    -   Click on the campaign in the dashboard to view real-time stats and logs.

## Security Note

This tool is for **educational and authorized testing purposes only**. Do not use this tool to target individuals or organizations without their explicit permission. The "fake login" pages in this project are designed to simulate credential harvesting but **do not store** any submitted passwords.

## License

MIT
