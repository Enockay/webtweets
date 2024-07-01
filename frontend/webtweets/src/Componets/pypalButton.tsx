import React, { useEffect, useState } from 'react';
import axios from 'axios';

const endpoint = 'https://webtweets-dawn-forest-2637.fly.dev/paypal';

interface PayPalButtonProps {
  price: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ price, onSuccess, onError }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [buttonRendered, setButtonRendered] = useState(false);

  useEffect(() => {
    const loadPaypalScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.getElementById('paypal-script')) {
          setScriptLoaded(true);
          return resolve();
        }
        
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AfOFjyozoEEnDqXBhpg8ZZdMpQzMc1RSbWculjLhZWwcSE_4ennV5PodWoLKVR0Wn0aoBKBujIy35ol5`;
        script.async = true;
        script.id = 'paypal-script';
        script.onload = () => {
          setScriptLoaded(true);
          resolve();
        };
        script.onerror = (error) => reject(error);
        document.body.appendChild(script);
      });
    };

    const createOrder = async () => {
      try {
        const response = await axios.post(`${endpoint}/create-order`, { price });
        return response.data.id;
      } catch (error) {
        onError(error);
      }
    };

    const onApprove = async (data: any) => {
      try {
        const response = await axios.post(`${endpoint}/capture-order`, { orderId: data.orderID });
        onSuccess(response.data);
      } catch (error) {
        onError(error);
      }
    };

    const renderPaypalButton = () => {
      if (!buttonRendered && window.paypal) {
        window.paypal.Buttons({
          createOrder,
          onApprove,
        }).render('#paypal-button-container');
        setButtonRendered(true);
      }
    };

    const initPaypalButton = async () => {
      if (!scriptLoaded) {
        await loadPaypalScript();
      }
      renderPaypalButton();
    };

    initPaypalButton();
  }, [price, onSuccess, onError, scriptLoaded, buttonRendered]);

  return <div id="paypal-button-container" />;
};

export default PayPalButton;
