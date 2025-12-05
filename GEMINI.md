# Szyszkojny Project

This project is a full-stack application with a Django backend and a Next.js frontend.

## Project Structure

- `backend/`: Contains the Django backend application.
- `frontend/`: Contains the Next.js frontend application.
- `secrets/`: Contains service account keys and other secrets.

## Getting Started

### Prerequisites

- **Python 3 and Pip**: Ensure you have Python 3 and `pip` installed. On Debian-based systems, you may need to install `python3-pip` and `python3-venv`.
- **Node.js and npm**: Required for the frontend.
- **Firebase Project**: A Firebase project is required, and you will need to generate a service account key.

### Backend Setup

1.  **Firebase Credentials**:
    -   Create a `secrets/` directory in the project root if it doesn't exist.
    -   Download your Firebase service account key and save it as `secrets/serviceAccountKey.json`.

2.  **Create a Virtual Environment**:
    It is recommended to use a virtual environment to manage Python dependencies.
    ```bash
    python3 -m venv backend/.venv
    source backend/.venv/bin/activate
    ```

3.  **Install Dependencies**:
    Navigate to the `backend/` directory and install the required packages.
    ```bash
    cd backend/
    pip install -r requirements.txt
    ```

4.  **Configure Django Settings**:
    Open `backend/szyszkojny/settings.py` and make the following changes:
    -   Add your server's IP address or domain name to the `ALLOWED_HOSTS` list.
        ```python
        ALLOWED_HOSTS = ["<your_ip_or_domain>", "127.0.0.1", "localhost"]
        ```
    -   Add a regex for your frontend's origin to `CORS_ALLOWED_ORIGIN_REGEXES`.
        ```python
        CORS_ALLOWED_ORIGIN_REGEXES = [
            r"^http://localhost:....$",
            r"^http://127\.0\.0\.1:....$",
            r"^http://<your_ip_or_domain>:....$",
        ]
        ```

5.  **Apply Database Migrations**:
    ```bash
    python manage.py migrate
    ```

6.  **Run the Django Development Server**:
    To make the backend accessible on your network, run the server with `0.0.0.0`.
    ```bash
    python manage.py runserver 0.0.0.0:8000
    ```
    The backend API will be available at `http://<your_ip_or_domain>:8000/`.

### Frontend Setup

1.  **Install Dependencies**:
    Navigate to the `frontend/` directory and install the Node.js packages.
    ```bash
    cd frontend/
    npm install
    ```

2.  **Configure Environment**:
    Create a `.env.local` file in the `frontend/` directory. This file will hold the URL of your backend API.
    ```
    NEXT_PUBLIC_API_URL=http://<your_ip_or_domain>:8000/api/
    ```

3.  **Run the Next.js Development Server**:
    The `dev` script in `package.json` is configured to host the application on your network.
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://<your_ip_or_domain>:3000/`.
