# Szyszkojny

Szyszkojny is a web application that allows users to collect and transfer points to their accounts by scanning QR codes. Originally developed as a tool for Polish scouts, it helps manage wide games and events with complex scoring systems.

## Features

-   Collect points by scanning QR codes
-   Transfer points between user accounts
-   User authentication and account management
-   Admin interface for managing codes and users
-   Designed for flexibility in event scoring and management

## Project Structure

-   `backend/` – Django backend API and admin panel
    -   `api/` – Core app logic, models, views, serializers
    -   `szyszkojny/` – Django project settings
-   `frontend/` – Next.js frontend for user interaction
    -   `app/` – Main application pages and components
-   `secrets/` – Configuration and secret files (not for public sharing)

## Try It Out

Scan this QR code in the app to earn your first coins:

<p align="center">
  <img src="tutorial-qr.png" alt="Tutorial QR code" width="250">
</p>

## Getting Started

### Prerequisites

-   Python 3.12+
-   Node.js 18+
-   npm or yarn

### Backend Setup

1. Navigate to the backend directory:
    ```powershell
    cd backend
    ```
2. Install dependencies:
    ```powershell
    pip install -r requirements.txt
    ```
3. Run migrations:
    ```powershell
    python manage.py migrate
    ```
4. Start the backend server:
    ```powershell
    python manage.py runserver
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```powershell
    cd frontend
    ```
2. Install dependencies:
    ```powershell
    npm install
    ```
3. Start the frontend development server:
    ```powershell
    npm run dev
    ```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License

See [LICENSE](LICENSE) for details.
