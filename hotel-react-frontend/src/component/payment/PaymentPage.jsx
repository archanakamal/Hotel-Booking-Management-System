import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaymentForm from "./PaymentForm"; // Your Stripe form component
import ApiService from "../../service/ApiService";

const PaymentPage = () => {
  const { bookingReference, amount } = useParams();
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const secret = await ApiService.proceedForPayment({ bookingReference, amount });
        setClientSecret(secret);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Failed to initiate payment.");
      }
    };
    fetchClientSecret();
  }, [bookingReference, amount]);

  const stripePromise = loadStripe(
    "pk_test_51Scn34F1LBS00kzC51LDpQk9gLzQIKjvwa9dfYXyHLRkU2IQv6dJXKaxOCiilaYWuYCmJOnoX4nxfCjRUf63NqS70028RIRKGM"
  );

  const handlePaymentStatus = async (status, transactionId = "", failureReason = "") => {
    try {
      await ApiService.updateBookingPayment({
        bookingReference,
        amount,
        transactionId,
        success: status === "succeeded",
        failureReason,
      });
      console.log("Payment status updated:", status);
    } catch (err) {
      console.error("Failed to update payment status:", err.message);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!clientSecret) return <div>Loading payment information...</div>;

  return (
    <div className="payment-page">
      <h2>Booking: {bookingReference}</h2>
      <h3>Amount: ₹{amount}</h3>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm
          clientSecret={clientSecret}  // <-- make sure prop name is correct
          amount={amount}
          onPaymentSuccess={(transactionId) => {
            setPaymentStatus("succeeded");
            handlePaymentStatus("succeeded", transactionId);
            navigate(`/payment-success/${bookingReference}`);
          }}
          onPaymentError={(err) => {
            setPaymentStatus("failed");
            handlePaymentStatus("failed", "", err);
            navigate(`/payment-failed/${bookingReference}`);
          }}
        />
      </Elements>

      {paymentStatus && <div>Payment Status: {paymentStatus}</div>}
    </div>
  );
};

export default PaymentPage;
