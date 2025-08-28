
export const SAMPLE_CODE = `
import stripe
import redis
from flask import Flask, request, jsonify

# Assume these are configured elsewhere
stripe.api_key = "sk_test_..."
redis_client = redis.Redis(host='localhost', port=6379, db=0)
app = Flask(__name__)

class PaymentException(Exception):
    """Custom exception for payment processing errors."""
    pass

class FraudException(Exception):
    """Custom exception for detected fraud."""
    pass

class PaymentResult:
    def __init__(self, transaction_id, status, amount):
        self.transaction_id = transaction_id
        self.status = status
        self.amount = amount

def validate_card(card_token: str) -> bool:
    """Validates card token format."""
    return card_token.startswith('tok_')

def process_payment(amount: float, card_token: str, metadata: dict) -> PaymentResult:
    """
    Process payment transaction with retry logic and fraud detection.

    Args:
        amount (float): Transaction amount in USD.
        card_token (str): Tokenized card information.
        metadata (dict): Additional transaction metadata.

    Returns:
        PaymentResult: Object containing transaction ID and status.

    Raises:
        PaymentException: If payment processing fails.
        FraudException: If fraud is detected.
    """
    if not validate_card(card_token):
        raise PaymentException("Invalid card token provided.")

    user_id = metadata.get('user_id')
    if user_id and redis_client.get(f"fraud_risk:{user_id}"):
        raise FraudException(f"High fraud risk for user {user_id}")

    try:
        charge = stripe.Charge.create(
            amount=int(amount * 100),  # Amount in cents
            currency="usd",
            source=card_token,
            description="MyOnsite Healthcare charge",
            metadata=metadata
        )
        return PaymentResult(charge.id, 'success', amount)
    except stripe.error.CardError as e:
        raise PaymentException(f"Card error: {e.user_message}")
    except Exception as e:
        # Generic error for other Stripe or network issues
        raise PaymentException(f"Payment processing failed: {str(e)}")

@app.route('/charge', methods=['POST'])
def create_charge():
    data = request.get_json()
    try:
        result = process_payment(
            amount=data['amount'],
            card_token=data['card_token'],
            metadata={'user_id': data.get('user_id')}
        )
        return jsonify({
            "transaction_id": result.transaction_id,
            "status": result.status
        }), 200
    except (PaymentException, FraudException) as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An internal error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True)
`;

export enum Tab {
  Analysis = 'Analysis',
  Documentation = 'Documentation',
  README = 'README',
  Tests = 'Tests',
  QA = 'Q&A',
}