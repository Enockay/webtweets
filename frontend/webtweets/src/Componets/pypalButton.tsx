import React, { useEffect } from 'react';
 
interface PayPalButtonProps {
  price: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ price, onSuccess, onError }) => {
  useEffect(() => {
    const loadPaypalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID`;
      script.async = true;
      script.onload = () => {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            console.log(data);
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: price
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            console.log(data)
            try {
              const details = await actions.order.capture();
              onSuccess(details);
            } catch (error) {
              onError(error);
            }
          }
        }).render('#paypal-button-container');
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      loadPaypalScript();
    } else {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          console.log(data);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: price
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          console.log(data);
          try {
            const details = await actions.order.capture();
            onSuccess(details);
          } catch (error) {
            onError(error);
          }
        }
      }).render('#paypal-button-container');
    }
  }, [price, onSuccess, onError]);

  return <div id="paypal-button-container" />;
};

export default PayPalButton;
