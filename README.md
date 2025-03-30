# My Finance - Personal Finance Management with AI Assistance


**My Finance** is a comprehensive web application designed to simplify personal finance management. It provides users with a suite of tools to manage bills, transactions, and savings effectively. With AI-powered chat assistance, adding expenses and managing finances becomes effortless. Robust report generation capabilities offer deep insights into spending and saving habits, empowering users to achieve their financial goals.

**Key Features:**

* **Bills Management:** Easily track and manage your recurring and one-time bills.
* **Transaction Tracking:** Log and categorize your income and expenses for accurate financial tracking.
* **Savings Management:** Set savings goals and monitor your progress.
* **AI-Powered Chat Assistance:** Add bills, transactions, and expenses quickly using natural language.
* **Detailed Report Generation:** Generate comprehensive financial reports for analysis.
* **Intuitive User Interface:** A user-friendly design for seamless navigation.
* **Internationalization & Localization:** Support for diverse user preferences and geographical locations.

## About The Project

My Finance aims to provide a robust and user-friendly platform for personal finance management. By integrating AI assistance, it streamlines the process of managing finances, making it accessible to users of all technical backgrounds. The detailed report generation empowers users to gain a clear understanding of their financial health, fostering better financial decision-making.

## Tech Stack

**Frontend:**

* React.js
* Magic UI
* Shadcn UI
* i18n (internationalization)

**Backend:**

* Express.js
* PostgreSQL
* Sequelize ORM

**DevOps:**

* Git
* Gitflow
* Docker

**Testing:**

* Jest
* Cypress
* Sentry (Error Handling)

**AI:**

* GROQ AI  (for natural language interpretation)

## Getting Started

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/Keerthilochankumar/MyFinance.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd my-finance
    ```

3.  Install dependencies (frontend):

    ```bash
    cd client
    npm install 
    ```

4.  Install dependencies (backend):

    ```bash
    cd server
    npm install 
    ```

5.  Configure environment variables:

    * Create `.env` files in both `client` and `server` directories based 
    * Set up your PostgreSQL database and configure the connection details in the server's `.env` file.
    * Add your groq API key in the server's `.env` file.

6.  Run the application:

    ```bash
    # Start the backend server
    cd server
    npm run dev 
 

    # Start the frontend development server
    cd client
    npm run dev 
    ```

### Usage

Access the application in your browser at `http://localhost:3000`. Use the intuitive interface to manage your bills, transactions, and savings. Leverage the AI-powered chat assistance, powered by Groq AI , to quickly add expenses and generate financial reports for analysis.
