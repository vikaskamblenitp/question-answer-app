# Question Answer Application

Welcome to the Question Answer Application! This project is designed to provide a robust and scalable solution for generating and answering questions using advanced AI models. The application leverages a variety of technologies to ensure efficient data handling, storage, and processing.

## Tech Stack

- **Langchain**: For building and managing the question-answering logic.
- **Bull Queue**: For asynchronous processing of PDF files.
- **PgVector**: For efficient vector similarity search.
- **Minio**: For file uploads and storage.
- **OpenAI Model**: For generating embeddings and answering questions.
- **Docker**: For containerization and easy deployment.

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

3. **Start the application**:
  ```sh
  docker-compose up -d
  ```

### API Endpoints

- **Login**: `/api/login`
- **Register**: `/api/register`

These endpoints are temporary and will be replaced with Google SSO login in future updates.

## Future Enhancements

- **Google SSO Login**: To provide a seamless and secure login experience.
- **Rate Limiting**: To ensure fair usage and prevent abuse of the API.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries or job opportunities, please contact me via [LinkedIn](https://www.linkedin.com/in/vikas-kamble07).

---

Thank you for checking out the Question Answer Application! Your feedback and contributions are highly appreciated.
