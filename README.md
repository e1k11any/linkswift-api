# 🚀 LinkSwift API

LinkSwift is a high-performance, scalable URL shortening API built with Node.js, Express, MongoDB, and Redis. This project demonstrates best practices in API design, test-driven development (TDD), caching, and security.

## ✨ Features

- **Shorten URL:** Create a new short link from a long URL (`POST /api/v1/shorten`).
- **Fast Redirects:** Blazing-fast `GET /:shortCode` redirects, powered by a Redis cache-aside strategy.
- **Analytics:** Tracks click counts for every link.
- **Security:** Rate limiting on all endpoints to prevent abuse.
- **Clean Architecture:** Follows a modular and testable folder structure.
- **TDD:** 100% test coverage with Jest and Supertest.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (with Mongoose)
- **Cache:** Redis (for caching and rate limiting)
- **Testing:** Jest, Supertest
- **Validation:** `express-validator`
- **Utilities:** `nanoid`, `dotenv`, `express-async-handler`

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or via Atlas)
- [Redis](https://redis.io/docs/getting-started/installation/) (running locally)

### 1. Clone the Repository

```bash
git clone https://github.com/e1k11any/linkswift-api
cd linkswift
```
