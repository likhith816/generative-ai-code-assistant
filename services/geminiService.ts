import { GoogleGenAI, Type } from "@google/genai";
import type { CodeAnalysisResult, QueryResponse, ChatEntry } from "../types";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        request_id: { type: Type.STRING },
        code_analysis: {
            type: Type.OBJECT,
            properties: {
                file_path: { type: Type.STRING },
                language: { type: Type.STRING },
                metrics: {
                    type: Type.OBJECT,
                    properties: {
                        lines_of_code: { type: Type.INTEGER },
                        cyclomatic_complexity: { type: Type.INTEGER },
                        maintainability_index: { type: Type.NUMBER },
                        test_coverage: { type: Type.NUMBER },
                    },
                    required: ["lines_of_code", "cyclomatic_complexity", "maintainability_index", "test_coverage"]
                },
                dependencies: {
                    type: Type.OBJECT,
                    properties: {
                        internal: { type: Type.ARRAY, items: { type: Type.STRING } },
                        external: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["internal", "external"]
                },
                ast_summary: {
                    type: Type.OBJECT,
                    properties: {
                        classes: { type: Type.INTEGER },
                        functions: { type: Type.INTEGER },
                        complexity_hotspots: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                     required: ["classes", "functions", "complexity_hotspots"]
                }
            },
            required: ["file_path", "language", "metrics", "dependencies", "ast_summary"]
        },
        documentation_generated: {
            type: Type.OBJECT,
            properties: {
                function_docs: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            function_name: { type: Type.STRING },
                            signature: { type: Type.STRING },
                            docstring: { type: Type.STRING },
                            complexity_score: { type: Type.INTEGER },
                            generated_examples: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ["function_name", "signature", "docstring", "complexity_score", "generated_examples"]
                    }
                },
                api_documentation: {
                    type: Type.OBJECT,
                    properties: {
                        openapi_version: { type: Type.STRING },
                        endpoints_documented: { type: Type.INTEGER },
                        schemas_generated: { type: Type.INTEGER },
                        example_requests: { type: Type.BOOLEAN },
                    },
                    required: ["openapi_version", "endpoints_documented", "schemas_generated", "example_requests"]
                },
                readme_sections: {
                    type: Type.OBJECT,
                    properties: {
                        overview: { type: Type.STRING },
                        installation: { type: Type.STRING },
                        usage: { type: Type.STRING },
                        api_reference: { type: Type.STRING },
                    },
                    required: ["overview", "installation", "usage", "api_reference"]
                }
            },
            required: ["function_docs", "api_documentation", "readme_sections"]
        },
        tests_generated: {
            type: Type.OBJECT,
            properties: {
                unit_tests: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            test_name: { type: Type.STRING },
                            test_code: { type: Type.STRING },
                            coverage_impact: { type: Type.STRING },
                            edge_cases_covered: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ["test_name", "test_code", "coverage_impact", "edge_cases_covered"]
                    }
                },
                integration_tests: { type: Type.INTEGER },
                property_tests: { type: Type.INTEGER },
                total_coverage: { type: Type.NUMBER },
                mutation_score: { type: Type.NUMBER },
            },
            required: ["unit_tests", "integration_tests", "property_tests", "total_coverage", "mutation_score"]
        },
        query_response: {
            type: Type.OBJECT,
            properties: {
                query: { type: Type.STRING },
                response: { type: Type.STRING },
                code_references: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            file: { type: Type.STRING },
                            lines: { type: Type.STRING },
                            relevance_score: { type: Type.NUMBER },
                        },
                        required: ["file", "lines", "relevance_score"]
                    }
                },
                suggested_improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence_score: { type: Type.NUMBER },
            },
            required: ["query", "response", "code_references", "suggested_improvements", "confidence_score"]
        }
    },
    required: ["request_id", "code_analysis", "documentation_generated", "tests_generated", "query_response"]
};

const queryResponseSchema = responseSchema.properties.query_response;


const createMockResponse = (code: string): CodeAnalysisResult => ({
  request_id: `REQ-${new Date().toISOString()}`,
  code_analysis: {
    file_path: "src/services/payment_processor.py",
    language: "python",
    metrics: {
      lines_of_code: code.split('\n').length,
      cyclomatic_complexity: 12,
      maintainability_index: 75.3,
      test_coverage: 0.82
    },
    dependencies: {
      internal: ["auth_service", "database_handler"],
      external: ["stripe", "requests", "redis", "flask"]
    },
    ast_summary: {
      classes: 3,
      functions: 4,
      complexity_hotspots: ["process_payment", "create_charge"]
    }
  },
  documentation_generated: {
    function_docs: [
      {
        function_name: "process_payment",
        signature: "def process_payment(amount: float, card_token: str, metadata: dict) -> PaymentResult:",
        docstring: "Process payment transaction with retry logic and fraud detection.\\n\\nArgs:\\n amount (float): Transaction amount in USD\\n card_token (str): Tokenized card information\\n metadata (dict): Additional transaction metadata\\n\\nReturns:\\n PaymentResult: Object containing transaction ID and status",
        complexity_score: 8,
        generated_examples: [
          "result = process_payment(99.99, 'tok_visa', {'user_id': 123})\\nprint(result.transaction_id)"
        ]
      }
    ],
    api_documentation: {
      openapi_version: "3.0.0",
      endpoints_documented: 1,
      schemas_generated: 2,
      example_requests: true
    },
    readme_sections: {
      overview: "This service handles payment processing using Stripe.",
      installation: "Run `pip install -r requirements.txt` and set STRIPE_API_KEY.",
      usage: "Send a POST request to /charge with amount, card_token, and user_id.",
      api_reference: "See OpenAPI specification for more details."
    }
  },
  tests_generated: {
    unit_tests: [
      {
        test_name: "test_process_payment_success",
        test_code: "def test_process_payment_success():\\n # Arrange\\n mock_stripe = MagicMock()\\n amount = 99.99\\n # Act\\n result = process_payment(amount, 'tok_visa', {'user_id': '123'})\\n # Assert\\n assert result.status == 'success'\\n assert result.amount == amount",
        coverage_impact: "+3.2%",
        edge_cases_covered: ["zero_amount", "max_amount", "invalid_token"]
      }
    ],
    integration_tests: 1,
    property_tests: 0,
    total_coverage: 0.85,
    mutation_score: 0.78
  },
  query_response: {
    query: "How does the payment retry logic work?",
    response: "The payment retry logic in `process_payment` is handled by the underlying Stripe library. For robust retries, consider implementing an exponential backoff strategy with a library like `tenacity`.",
    code_references: [
      {
        file: "payment_processor.py",
        lines: "45-60",
        relevance_score: 0.95
      }
    ],
    suggested_improvements: [
      "Consider adding circuit breaker pattern",
      "Implement idempotency keys for retries"
    ],
    confidence_score: 0.92
  }
});

export const analyzeCodeWithGemini = async (code: string): Promise<CodeAnalysisResult> => {
  if (!process.env.API_KEY) {
    console.warn("API key not provided via environment variable. Using mocked Gemini response.");
    // Simulate network delay for mock
    return new Promise(resolve => setTimeout(() => resolve(createMockResponse(code)), 1500));
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
You are a 'Generative AI Agent for Code Documentation & QA'. Given the following code snippet, perform a comprehensive analysis and generate a response in a JSON format that strictly adheres to the provided schema. Extract the full function signature for each function. Do not add any extra text or explanations outside of the JSON structure.
The user wants to know "How does the payment retry logic work?". Include this in your query_response.

CODE:
\`\`\`
${code}
\`\`\`
`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      }
    );

    const jsonText = response.text.trim();
    // In rare cases, the output might still contain markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');
    const result = JSON.parse(cleanedJsonText);
    return result as CodeAnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI. The model may have returned an invalid format.");
  }
};

const createMockFollowUpResponse = (question: string): QueryResponse => ({
    query: question,
    response: `This is a mock follow-up response to your question: "${question}". The core logic for this is located in the 'process_payment' function, which utilizes the Stripe API.`,
    code_references: [
        {
            file: "payment_processor.py",
            lines: "45-60",
            relevance_score: 0.88
        }
    ],
    suggested_improvements: ["Consider adding more detailed logging around the Stripe API call."],
    confidence_score: 0.85
});

export const askFollowUpQuestion = async (
    code: string, 
    question: string, 
    history: ChatEntry[]
): Promise<QueryResponse> => {
    if (!process.env.API_KEY) {
        console.warn("API key not provided via environment variable. Using mocked follow-up response.");
        return new Promise(resolve => setTimeout(() => resolve(createMockFollowUpResponse(question)), 1000));
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const conversationHistory = history.map(entry => {
        if (entry.type === 'user') {
            return `USER: ${entry.text}`;
        } else {
            return `AI: ${entry.data.response}`;
        }
    }).join('\n\n');

    const prompt = `
You are a 'Generative AI Agent for Code Documentation & QA'. You are in a follow-up conversation about a piece of code.
Use the original code and the conversation history provided below as context to answer the user's latest question.
Generate a response in a JSON format that strictly adheres to the provided schema. Do not add any extra text or explanations outside of the JSON structure.

ORIGINAL CODE:
\`\`\`
${code}
\`\`\`

CONVERSATION HISTORY:
${conversationHistory}

LATEST USER QUESTION: "${question}"
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: queryResponseSchema,
            },
        });

        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');
        const result = JSON.parse(cleanedJsonText);
        
        // Ensure the query from the model matches the user's question for consistency
        result.query = question;
        
        return result as QueryResponse;

    } catch (error) {
        console.error("Error calling Gemini API for follow-up:", error);
        throw new Error("Failed to get follow-up answer from AI.");
    }
};
