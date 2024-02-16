import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ZoomProvider } from './context/ZoomContext';
import { OneLineTitleProvider } from './context/OnelineTitleContext';
import { PageNumberProvider } from './context/PageNumberContext';
import ScriptSocketProvider from './context/ScriptSocketContext';
// import { PreLoader } from '@common';

function App() {
  return (
    <>
      {/* <PreLoader /> */}
      {/* set opacity of main to 0 when using preloader */}
      <ScriptSocketProvider>
        <OneLineTitleProvider>
          <ZoomProvider>
            <PageNumberProvider>
              <Box id="main">
                <Outlet />
              </Box>
            </PageNumberProvider>
          </ZoomProvider>
        </OneLineTitleProvider>
      </ScriptSocketProvider>
    </>
  );
}

export default App;
