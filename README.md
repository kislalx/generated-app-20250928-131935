# PlazaOps - Warehouse Management System

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kislalx/generated-app-20250928-131935)

> A modern, minimalist web application for warehouse and inventory management, featuring robust RBAC and a visually stunning, intuitive user interface.

PlazaOps is a sophisticated, minimalist web application for comprehensive warehouse and inventory management. Designed to mirror the robust functionality of the Erdoğan Traktör Plaza system, it provides a performant, intuitive, and visually stunning interface built on a modern web stack. The system features Role-Based Access Control (RBAC) to ensure users only access relevant modules.

## Key Features

-   **Real-time Dashboard:** At-a-glance view of critical KPIs and warehouse statistics.
-   **Comprehensive Stock Management:** Full CRUD functionality for inventory tracking, adjustments, and history.
-   **Warehouse & Shelf Management:** Manage physical locations, shelf structures, and inventory transfers.
-   **Service Management:** Schedule service appointments, create work orders, and track service history.
-   **Robust Administration:** Manage users, define roles, and assign granular permissions with a powerful RBAC system.
-   **Modern & Minimalist UI:** A clean, intuitive, and visually stunning interface built for clarity and ease of use.

## Technology Stack

-   **Frontend:** React, Vite, React Router
-   **Styling:** Tailwind CSS, shadcn/ui
-   **State Management:** Zustand (Client State), TanStack Query (Server State)
-   **Backend:** Hono on Cloudflare Workers
-   **Forms:** React Hook Form with Zod for validation
-   **Tooling:** TypeScript, Bun

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/plaza_ops.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd plaza_ops
    ```

3.  **Install dependencies:**
    ```bash
    bun install
    ```

### Environment Variables

Create a `.env` file in the root of the project. You may need to add environment variables for connecting to your backend services.

```env
# Example
VITE_API_BASE_URL=http://127.0.0.1:8788/api
```

## Development

To start the development server, which includes both the Vite frontend and the Hono backend worker, run:

```bash
bun dev
```

This will start the application, typically on `http://localhost:3000`. The server supports hot-reloading for a seamless development experience.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

### One-Click Deploy

You can deploy this application to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/kislalx/generated-app-20250928-131935)

### Manual Deployment via CLI

1.  **Build the project:**
    This command bundles the React application and the Cloudflare Worker for production.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    This command uses Wrangler to publish your application to Cloudflare Pages. You will need to be logged into your Cloudflare account via the CLI.
    ```bash
    bun run deploy
    ```

Wrangler will handle the process of uploading your static assets and worker code. After deployment, you will receive a unique URL for your live application.