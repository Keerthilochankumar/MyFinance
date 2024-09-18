const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(message) {
  const prompt = `
  Extract the following details from the message:
  - Operation Type (e.g., "bill", "saving", "transaction")
  - Amount (e.g., 12000)
  - Currency (e.g., INR)
  - Description (e.g., from office)
  - Due Date (e.g., yesterday or a specific date)
  - Type (e.g., expense, income) // Relevant for transactions
  - Category (e.g., food, utilities) // Relevant for transactions

  Message: "${message}"

  Provide the extracted information in JSON format:
  {
    "operationType": "<operationType>", // Type of operation (e.g., "bill", "saving", "transaction")
    "amount": "<amount>",
    "currency": "<currency>",
    "description": "<description>",
    "dueDate": "<dueDate>",
    "type": "<type>", // Relevant for transactions
    "category": "<category>" // Relevant for transactions
  }
  `;

  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama3-8b-8192',
  });
}

module.exports = { getGroqChatCompletion };
