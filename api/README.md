## API Reference

### Endpoint: `/api/ask`

**Description:** 
This has a single endpoint that allows users to interact with the LLM  or AI Agent. Pass a textual message describing your query, and the backend intelligently routes it to the appropriate tool (`advise_planting`, `crops_by_soil`, or `simulate_crop_profitability`) and returns a structured response.

### Request

**Method:** `POST`  
**Content-Type:** `application/json`

**Body Parameters:**

| Name    | Type   | Required | Description |
|---------|--------|----------|-------------|
| message | string | Yes      | A natural language query describing the user’s request. Examples include: "What crops can I plant at 25°C and 60% humidity?", "Show me crops for Loamy soil", or "Simulate profitability for Maize". |

### Usage Notes

- The `/api/ask` endpoint automatically parses the message to determine which tool to call (`advise_planting`, `crops_by_soil`, or `simulate_crop_profitability`).
- Ensure messages clearly mention the crop, soil, or environmental parameters for accurate responses.
- For profitability simulation, you can specify the number of simulations or confidence level directly in your message.
- The system **remembers up to 3 previous prompts** in a session, allowing for follow-up queries and context-aware responses.


