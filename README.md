# Lead Distribution MERN App 🚀

A full-stack MERN application built as a technical assessment. This project provides a complete solution for an administrator to log in, manage a team of agents, and automatically distribute sales or task leads by uploading a simple CSV or Excel file.

---
## ✨ Features

* **Secure Admin Authentication:** A dedicated login portal for the administrator, secured with JSON Web Tokens (JWT) for session management.
* **Agent Management:** A comprehensive dashboard where the admin can create new agents and view a list of all existing agents.
* **Flexible File Upload:** Supports `.csv`, `.xls`, and `.xlsx` file formats for uploading lead lists.
* **Automatic Distribution Algorithm:** The backend intelligently parses uploaded files and distributes the leads sequentially and equally among the first 5 agents.
* **Clean, Responsive UI:** A user-friendly interface built with React.js for a smooth administrative experience.

---
## 📸 Screenshot

*(You can replace this with a real screenshot of your dashboard)*
![Admin Dashboard Screenshot](https://i.postimg.cc/P5p823S7/image.png)

---
## 💻 Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JSON Web Tokens (JWT), bcrypt.js
* **File Handling:** Multer, csv-parser, xlsx

---
## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

You must have the following software installed:
* [Node.js](https://nodejs.org/) (which includes npm)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-project-folder>
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    *Open a new terminal for this step.*
    ```bash
    cd frontend
    npm install
    ```

4.  **Set up the Database:**
    * The database and collections (`admins`, `agents`, `leads`) will be created automatically when the server starts.
    * You must **manually create the first admin user**. Open MongoDB Compass, connect to your database, and inside the `admins` collection, insert the following document:
    ```json
    {
        "email": "admin@gmail.com",
        "password": "YOUR_BSON_HASH_FOR_THE_PASSWORD_'admin'",
        "role": "admin"
    }
    ```
    *(Use an online [Bcrypt Generator](https://bcrypt-generator.com/) to create the hash for the password `admin`)*

5.  **Configure Environment Variables:**
    * In the `backend` folder, create a new file named `.env`.
    * Add the following configuration. **Make sure your `MONGO_URI` includes the database name.**
    ```
    PORT=5000
    MONGO_URI=mongodb+srv://user:pass@cluster/lead_manager?retryWrites=true&w=majority
    JWT_SECRET=your_super_secret_and_long_jwt_key
    ```

6.  **Run the Application:**
    *You need to have two terminals open simultaneously.*
    * **In the first terminal (backend):**
        ```bash
        cd backend
        node index.js
        ```
        The backend will be running on `http://localhost:5000`.

    * **In the second terminal (frontend):**
        ```bash
        cd frontend
        npm start
        ```
        The frontend will open in your browser at `http://localhost:3000`.

---
## ⚙️ Usage

1.  Navigate to `http://localhost:3000/login`.
2.  Log in with the admin credentials you created (e.g., `admin@gmail.com` / `admin`).
3.  You will be redirected to the dashboard.
4.  Use the "Add New Agent" form to create at least 5 agents.
5.  Use the "Upload and Distribute Leads" form to upload a CSV or Excel file.
6.  A success or error message will appear, confirming the result of the distribution.

---
## 📜 License

This project is licensed under the MIT License.
