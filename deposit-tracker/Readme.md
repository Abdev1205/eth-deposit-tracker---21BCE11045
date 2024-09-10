# Deposit Tracker System

This project is a comprehensive deposit tracking system that monitors deposits into a specific contract, provides notifications, and logs deposit details into a MongoDB database. The system utilizes several services, including Grafana for visualizations, Prometheus for monitoring, and a tracker service to handle deposits and notifications.

## Features

- **Alchemy Webhook Integration**: This system integrates with Alchemy's API to monitor deposits to a specific contract on the blockchain. The deposit events are processed in real-time.
- **MongoDB Storage**: The tracker service stores deposit information in a MongoDB database, ensuring persistence of all deposit records.
- **Telegram Notifications**: The system sends notifications to a configured Telegram chat whenever a new deposit occurs. It also sends a summary of transactions processed after a 1-minute interval, informing the user about the total number of transactions and deposits processed during that time.

## Prerequisites

Before running this project, ensure you have the following installed:

### 1. Docker

Install Docker from [Docker's official website](https://docs.docker.com/get-docker/).

For most systems, you can install Docker with the following command:

- **Ubuntu**:

  ```bash
  sudo apt update
  sudo apt install docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
  ```

- **macOS**:  
  Download and install from [Docker Desktop for macOS](https://docs.docker.com/desktop/install/mac-install/).

- **Windows**:  
  Download and install from [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/).

### 2. Docker Compose

Docker Compose is usually included with Docker Desktop on macOS and Windows. For Linux:

```bash
sudo apt install docker-compose
```

### 3. Environment Variables

#### Required Environment Variables

```env
# Tracker Service
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
NOTIFICATION_SERVICE_URL=http://localhost:3000/api/notifications
ALCHEMY_API_KEY=<your-alchemy-api-key>
BEACON_DEPOSIT_CONTRACT=<your-contract-address></your-contract-address>

# Telegram Notifications
TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
TELEGRAM_CHAT_ID=<your-telegram-chat-id>
```

Replace `<username>`, `<password>`, `<dbname>`, `<your-alchemy-api-key>`, `<your-telegram-bot-token>`, and `<your-telegram-chat-id>` with your actual values.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/deposit-tracker.git
   cd deposit-tracker
   ```

2. Make sure the `.env` file is correctly populated with the required environment variables.

3. Build and run the services:

   ```bash
   docker-compose up --build
   ```

4. The following services will be available:
   - **Grafana**: Accessible at [http://localhost:3000](http://localhost:3000)
   - **Prometheus**: Accessible at [http://localhost:9090](http://localhost:9090)
   - **Tracker**: Accessible at [http://localhost:4000](http://localhost:4000)

### Demo Telegram Image where status is notified

![Status Update](https://i.postimg.cc/YqQMsdjM/Screenshot-2024-09-10-215135.png)

## Configuration

### Environment Variables Recap

- **Tracker Service**:

  - `DATABASE_URL`: The MongoDB connection string to store deposit information.
  - `NOTIFICATION_SERVICE_URL`: URL to Grafana's notification service API.
  - `ALCHEMY_API_KEY`: Your Alchemy API key to interact with blockchain data.
  - `BEACON_DEPOSIT_CONTRACT`: The Ethereum contract address that you are monitoring for deposits.
  - `TELEGRAM_BOT_TOKEN`: The token for your Telegram bot used to send deposit notifications.
  - `TELEGRAM_CHAT_ID`: The Telegram chat ID where the notifications will be sent.

- **Grafana Service**:
  - `TELEGRAM_BOT_TOKEN`: Same Telegram bot token as above.
  - `TELEGRAM_CHAT_ID`: Same Telegram chat ID for notifications.

## How It Works

1. **Deposit Tracking**: The system listens for deposit events on the specified Ethereum contract using the Alchemy API. When a deposit is detected, it stores the deposit data in MongoDB.

2. **Telegram Notifications**: Upon detecting a new deposit, the system immediately sends a notification to the specified Telegram chat. After one minute, it sends a summary of how many transactions were processed and how many deposits were found.

3. **Monitoring**: Prometheus collects metrics from the services, which are visualized in Grafana dashboards. This provides real-time insight into the system's performance and the deposits being tracked.

## Volumes

The Docker Compose file defines persistent volumes to store Grafana and Prometheus data:

- `grafana_data`: Stores Grafana dashboards and configuration.
- `prometheus_data`: Stores Prometheus metrics data.
- `mongodb_data`: (Optional) If you extend the compose file for MongoDB persistence.

## Troubleshooting

- **Docker Not Running**: If you encounter any issues starting Docker or Docker Compose, ensure Docker is running with:

  ```bash
  sudo systemctl status docker
  ```

- **Permission Denied Errors**: Run Docker commands with `sudo` if you're encountering permission issues.

## Contributing

Feel free to fork this project and open a pull request if you'd like to contribute!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
