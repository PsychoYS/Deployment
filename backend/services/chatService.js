const WIT_AI_TOKEN = process.env.WIT_AI_TOKEN;

class ChatService {
    constructor() {
        this.responses = {
            "greeting": "Hello! How can I help you today?",
            "check_balance": "To check your balance, please log into your account and visit the Account Summary page.",
            "transfer_money": "You can transfer money by using our secure transfer service in your account dashboard.",
            "report_fraud": "If you suspect fraud, please contact our security team immediately at 1-800-XXX-XXXX.",
            "get_help": "I am here to help! What specific assistance do you need?"
        };
    }

    async processMessage(message) {
        try {
            // Dynamically import node-fetch
            const fetch = (await import('node-fetch')).default;

            // Call Wit.ai API
            const witResponse = await fetch(
                `https://api.wit.ai/message?q=${encodeURIComponent(message)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${WIT_AI_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const witData = await witResponse.json();
            console.log('Wit.ai response:', witData);

            let responseMessage = {
                content: "I'm sorry, I didn't understand that.",
                sender: 'Bot',
                timestamp: new Date()
            };

            if (witData.intents && witData.intents.length > 0) {
                const intent = witData.intents[0].name;
                responseMessage.content = this.responses[intent] || responseMessage.content;
            }

            return { messages: [responseMessage] };
        } catch (error) {
            console.error('Chat processing error:', error);
            throw new Error('Error processing chat message');
        }
    }
}

module.exports = new ChatService(); 