import { BrowserRouter } from 'react-router-dom';
import { AuthProvider  } from './admin/context';
import CustomTheme from './config/components/CustomTheme';
import { Suspense } from 'react';
import { AbilityProvider } from './admin/context/AbilityContext';
import { useRouter } from '@hooks';
import {
  useRoutes
} from 'react-router-dom';
import { LoadingPage} from '@components'

const ConsoleApp = () => {
  const { mainNavigation } = useRouter();
  const navigation = useRoutes(mainNavigation);
 

   return (
    <AbilityProvider>
      <AuthProvider>
         <CustomTheme>     
           {navigation}
        </CustomTheme>
      </AuthProvider>
      </AbilityProvider>
  )
}

const AppWithRouter = () => {
  return (
    <Suspense fallback={ <LoadingPage/> }>
    <BrowserRouter>
      <ConsoleApp />
    </BrowserRouter>
  </Suspense>
  );
}

export default AppWithRouter;
