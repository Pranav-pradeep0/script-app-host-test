import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { Header, WithHeaderMargin } from '@common';
import { EditDocument, Home, Login, Signup } from '@pages';
import { ScriptHeader } from '@script';
import App from '@/App';
import LexicalComposerProvider from '@/context/LexicalComposerInitial';
import ErrorBoundary from '@common/errorBoundary';
import ScriptSocketProvider from '@/context/ScriptSocketContext';
import { VITE_BASE_URL } from '@/constants';
import IndexPage from '@pages/indexPage';
import { useZoom } from '@/context/ZoomContext';
import PricingPlans from '@common/pricing plans/PricingPlans';
import SubscriptionExpired from '@common/Subscription Expiry Page/SubscriptionExpired';
import UserProfile from '@common/Profile/UserProfile';
import DisplayPage from '@/components/Admin/DisplayPage';

const loadScriptData = async ({ params: { id } }) => {
  try {
    const response = await fetch(
      `${VITE_BASE_URL}/api/scripts/get-initial/${id}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for document with ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error('ERROR:', error);
    throw error;
  }
};

const ComposedScriptPage = () => {
  const { showSidebars } = useZoom();

  return (
    <LexicalComposerProvider>
      {/* <ScriptSocketProvider> */}
        {showSidebars && <ScriptHeader />}
        <WithHeaderMargin>
          <EditDocument />
        </WithHeaderMargin>
      {/* </ScriptSocketProvider> */}
    </LexicalComposerProvider>
  );
};

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: (
          <>
            <Header />
            <WithHeaderMargin>
              <Home />
            </WithHeaderMargin>
          </>
        ),
      },
      {
        path: '/subscribe',
        element: <PricingPlans></PricingPlans>
      },
      {
        path: '/document/:id',
        loader: loadScriptData,
        element: (
          <Suspense fallback={<div>Loading</div>}>
            <ComposedScriptPage />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/document/:id/index',
        element: <IndexPage />
      },
      {
        path: '/upgradeplan',
        element: <SubscriptionExpired/>
      },
      {
        path: '/profile/:userId',
        element: <UserProfile/>
      },
      {
        path: '/adminpanel',
        element: <DisplayPage/>
      }
    ],
  },
]);

export default appRouter;
