const { Bill, Saving, Transaction } = require('../models');
const { getGroqChatCompletion } = require('../groqUtils');

function parseDate(dateStr) {
  const now = new Date();
  if (dateStr === 'yesterday') {
    const date = new Date(now);
    date.setDate(now.getDate() - 1);
    return date.toISOString();
  } else if (dateStr === 'today') {
    return now.toISOString();
  } else if (dateStr === 'tomorrow') {
    const date = new Date(now);
    date.setDate(now.getDate() + 1);
    return date.toISOString();
  } else {
    const parsedDate = new Date(dateStr);
    return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : now.toISOString();
  }
}

function sanitizeJsonResponse(response) {
  try {
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = response.substring(jsonStart, jsonEnd + 1);

      const sanitizedString = jsonString
        .replace(/(\w+):/g, '"$1":') 
        .replace(/'(.*?)'/g, '"$1"'); 
      return JSON.parse(sanitizedString);
    }
  } catch (error) {
    throw new Error('Failed to sanitize and parse JSON: ' + error.message);
  }
  throw new Error('Invalid JSON format');
}

function formatAiResponse(aiResponse) {
  const content = aiResponse.choices[0].message.content;
  const jsonStart = content.indexOf('{');
  const jsonEnd = content.lastIndexOf('}');
  const jsonString = content.substring(jsonStart, jsonEnd + 1);
  let jsonData;

  try {
    jsonData = sanitizeJsonResponse(jsonString);
  } catch (error) {
    return { error: 'Failed to parse AI response: ' + error.message };
  }

  let formattedMessage = "Here’s what I understood from your message:\n\n";
  formattedMessage += `**Operation Type:** ${jsonData.operationType || 'Not provided'}\n`;
  formattedMessage += `**Amount:** ${jsonData.amount || 'Not provided'}\n`;
  formattedMessage += `**Currency:** ${jsonData.currency || 'Not provided'}\n`;
  formattedMessage += `**Description:** ${jsonData.description || 'Not provided'}\n`;
  formattedMessage += `**Due Date:** ${jsonData.dueDate || 'Not provided'}\n`;
  formattedMessage += `**Type:** ${jsonData.type || 'Not provided'}\n`;
  formattedMessage += `**Category:** ${jsonData.category || 'Not provided'}\n\n`;
  formattedMessage += "If you need further assistance, let me know!";

  return { message: formattedMessage };
}

exports.handleFinancialOperation = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const aiResponse = await getGroqChatCompletion(message);
    const aiMessage = aiResponse.choices[0].message.content;

    let jsonData;
    try {
      jsonData = sanitizeJsonResponse(aiMessage);
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse AI response: ' + parseError.message });
    }

    switch (jsonData.operationType) {
      case 'bill':
        const { amount, currency, description, dueDate } = jsonData;
        const formattedDueDate = parseDate(dueDate);

        const bill = await Bill.create({
          title: description || 'No Title',
          amount: amount || 0,
          currency: currency || 'USD',
          toWhom: description || 'Unknown',
          dueDate: formattedDueDate,
          userId
        });

        return res.status(201).json({ bill });

      case 'saving':
        const { amount: saveAmount, currency: saveCurrency, description: saveDesc, date: saveDate } = jsonData;
        const saving = await Saving.create({
          amount: saveAmount,
          currency: saveCurrency,
          desc: saveDesc,
          date: parseDate(saveDate),
          userId
        });

        return res.status(201).json({ saving });

      case 'transaction':
        const { amount: transAmount, type, currency: transCurrency, category, description: transDesc, date: transDate } = jsonData;
        const transaction = await Transaction.create({
          amount: transAmount,
          type,
          currency: transCurrency,
          category,
          desc: transDesc,
          date: parseDate(transDate),
          userId
        });

        return res.status(201).json({ transaction });

      case 'balance_inquiry':
        const userBalance = await getUserBalance(userId); 
        return res.status(200).json({ message: `Your current balance is ${userBalance}.` });

      case 'upcoming_bills':
        const upcomingBills = await Bill.findAll({ where: { userId, dueDate: { $gte: new Date() } } });
        return res.status(200).json({ message: `You have ${upcomingBills.length} upcoming bills.`, bills: upcomingBills });

      default:
        const formattedResponse = formatAiResponse(aiResponse);
        return res.status(200).json(formattedResponse);
    }
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while processing your request: ' + error.message });
  }
};
