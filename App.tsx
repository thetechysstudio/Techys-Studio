
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { OrderState, CustomerDetails, ApiPlan } from './types.ts';
import Home from './src/pages/Home.tsx';
import ProductDetail from './src/pages/ProductDetail.tsx';
import Plans from './src/pages/Plans.tsx';
import Customization from './src/pages/Customization.tsx';
import Checkout from './src/pages/Checkout.tsx';
import Confirmation from './src/pages/Confirmation.tsx';
import Login from './src/pages/Login.tsx';
import Signup from './src/pages/Signup.tsx';
import Orders from './src/pages/Orders.tsx';
import OrdersDetails from './src/pages/OrdersDetails.tsx';
import Hero from './src/components/Hero.tsx';
import Main from './src/pages/Memory Card Polaroids Design/Main.tsx';
import Scan from './src/pages/Music Card/Scan.tsx';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderState>({
    title: '',
    description: '',
    tagline: '',
    quantity: 1,
    templateId: 't1'
  });
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);

  const handlePlanSelect = (plan: ApiPlan) => {
    if (plan.custom) {
      alert(`Our team will reach out for the "${plan.title}" consultation.`);
      return;
    }
    setOrder(prev => ({ ...prev, plan }));
    navigate(`/customization/${plan.id}`);
  };

  const handleCompleteCustomization = (finalOrder: OrderState) => {
    setOrder(finalOrder);
    navigate('/checkout');
  };

  const handleCompleteCheckout = (details: CustomerDetails) => {
    setCustomer(details);
    navigate('/confirmation');
  };

  return (
    <div className="antialiased">
      <Routes>
        <Route path="/" element={
          <Hero />
          // <Scan/>
        } />

        <Route path="/home" element={
          <Home onShopNow={() => navigate('/product-single')} onSeePlans={() => navigate('/plans')} />
        } />

        <Route path="/login" element={
          <Login />
        } />
        <Route path="/signup" element={
          <Signup />
        } />

        <Route path="/product" element={
          <ProductDetail onBack={() => navigate('/')} />
        } />
        <Route path="/product-single" element={
          <ProductDetail onBack={() => navigate('/')} singleMode={true} />
        } />

        <Route path="/plans/:id" element={
          <Plans onBack={() => navigate('/product')} onSelectPlan={handlePlanSelect} />
        } />
        <Route path="/customization/:planId" element={
          <Customization order={order} onBack={() => navigate('/plans/1')} onNext={handleCompleteCustomization} />
        } />
        <Route path="/checkout" element={
          <Checkout order={order} onBack={() => navigate('/customization')} onConfirm={handleCompleteCheckout} />
        } />
        <Route path="/confirmation" element={
          <Confirmation  />
        } />

        <Route path="/orders" element={
          <Orders />
        } />

        <Route path="/orders/:id" element={
          <OrdersDetails />
        } />

        <Route path='/memory-card-designs' element={
          <Main/>
        } />
        <Route path='/music-card-scan' element={
          <Scan/>
        } />

      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
