# Question Answer Application

Welcome to the Question Answer Application! This project is designed to provide a robust and scalable solution for generating and answering questions using advanced AI models. The application leverages a variety of technologies to ensure efficient data handling, storage, and processing.

This project also includes a rate limiter based on the token bucket algorithm using Redis. This ensures fair usage and prevents abuse of the API by limiting the number of requests a user can make within a certain time frame for resource intensive APIs.

## Tech Stack

- **Langchain**: For building and managing the question-answering logic.
- **Bull Queue**: For asynchronous processing of PDF files.
- **PgVector**: For efficient vector similarity search.
- **Minio**: For file uploads and storage.
- **OpenAI Model**: For generating embeddings and answering questions.
- **Docker**: For containerization and easy deployment.
- **Redis**: For rate limiting

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- A valid OpenAI API key for generating embeddings and answering questions.

### Installation

1. **Clone the repository**:
  ```sh
  git clone https://github.com/vikaskamblenitp/question-answer-app
  cd question-answer-app
  ```

2. **Setup environment variables**:
  - Copy the example environment file:
    ```sh
    cp .env.example .env
    cp .env.example .env.local
    ```
  - Update `.env` and `.env.local` with your configuration, including `CONFIG_OPEN_API_KEY`.

3. **Run required containers for the project**:
  ```sh
  docker-compose up -d
  ```

4. **Scripts for Database migrations**:
  ```sh
  npm run migrate:up ## up the db migrations
  npm run migrate:create <file_name> ## file name
  npm run migrate:down ## down the script
  ```

1. **Start the application**:
  ```sh
  npm run dev ## run the application
  ```

### API Endpoints

- **Login**: `/api/v1/users/login`
- **Register**: `/api/v1/users/register`

These endpoints are temporary and will be replaced with Google SSO login in future updates.

- **PDF processing**: `/api/v1/documents`
- **Processing status and details**: `/api/v1/documents/:documentID`
- **Get answers for question on a file**: `/api/v1/qa/file/:fileID/answer`
- **Get all Q&A history for a file**: `/api/v1/file/:fileID`


## Future Enhancements

- **Google SSO Login**: To provide a seamless and secure login experience.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or job opportunities, please contact me via [LinkedIn](https://www.linkedin.com/in/vikas-kamble07).

---

Thank you for checking out the Question Answer Application! Your feedback and contributions are highly appreciated.
