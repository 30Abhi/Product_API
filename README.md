
## Overview
A lightweight, OpenAI‑powered Product API that takes product titles or basic details and returns rich marketing copy—including descriptions, FAQs, bullet points, pros & cons, and meta tags—in JSON format.

Built with Node.js and Express, this API abstracts away manual copywriting by integrating directly with OpenAI’s GPT models to deliver high‑quality content on demand.

##🛠️ Tech Stack
Node.js: A cross‑platform, open‑source JavaScript runtime built on Chrome’s V8 engine, enabling server‑side scripting with JavaScript 


Express.js: Minimal and flexible Node.js web framework providing robust routing and middleware support for rapid API development 


OpenAI API: GPT‑powered completions and chat endpoints for generative text, including product descriptions and FAQs 

Mongo Databse: Uses Mongo URI to interact and fetch product names .(see env configurations below)


dotenv: Zero‑dependency module to load environment variables from a .env file into process.env, following Twelve‑Factor App methodology

## ✨ Features
Generate Product Descriptions: Submit a title or basic specs and receive an engaging, SEO‑friendly description.

Auto‑FAQ Generation: Produce commonly asked Q&A pairs based on product context.

Bullet‑Point Highlights: Create concise feature lists and pros/cons summaries.

Meta Tags & SEO: Auto‑generate meta titles, descriptions, and keywords.

RESTful Endpoints: Standard HTTP methods, JSON payloads, and clear status codes.


## 🚀 Quick Start
Prerequisites
Node.js (>= v14) installed on your system 
nodejs.org

npm or yarn for dependency management

OpenAI API key (sign up at platform.openai.com to obtain one) 
OpenAI Platform

Installation
Clone the repo

bash
Copy
Edit
git clone https://github.com/30Abhi/Product_API.git
cd Product_API
Install dependencies

bash
Copy
Edit
npm install
# or
yarn install


## ▶️Configuration
Create a .env file in the project root:

Port={Your port}
Deepseek_API={DeepSeek_API}
Deepseek_URL={DeepSeek_URL}
MONGO_URI={Database URI }



## ▶️ Running the API
Development (with nodemon):

bash
Copy
Edit
npm run dev
Production:

bash
Copy
Edit
npm start


## Performance & Cost Analysis ⏱️💸

### Throughput Time
| Endpoint | Avg. Response Time | Factors Affecting Speed |
|----------|--------------------|-------------------------|
| All endpoints | 2-5 seconds | - OpenAI API latency<br>- Input complexity<br>- Server resources<br>- Network speed |

Typical workflow for 100 product descriptions:
1. API calls: ~100 requests
2. Total time: 4-8 minutes (at 3-5 seconds/request)
3. Parallel processing recommended for bulk operations

### Cost Estimation (OpenAI)
Based on GPT-3.5-turbo-instruct pricing ($0.002/1K tokens):
| Component | Tokens/Request | Cost/Request | Cost per 1K Requests |
|-----------|----------------|--------------|----------------------|
| Prompt | ~50 tokens | $0.0001 | $0.10 |
| Response | ~100 tokens | $0.0002 | $0.20 |
| **Total** | **150 tokens** | **$0.0003** | **$0.30** |

**Example Scenario**:
- Generating 500 product descriptions:
  - Total tokens: 500 × 150 = 75,000
  - Estimated cost: 75 × $0.002 = $0.15


