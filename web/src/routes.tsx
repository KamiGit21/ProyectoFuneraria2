import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import RegistrarCliente from './pages/RegistrarCliente';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function MainRoutes() {
  const location = useLocation();

  const hideOnPaths = ['/login'];
  const showNavbar = !hideOnPaths.includes(location.pathname);
  const showFooter = !hideOnPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col"> {/* Hace que el footer baje */}
      {showNavbar && <Navbar />}

      <div className="flex-grow"> {/* Empuja el footer al fondo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/RegistrarCliente"
            element={
              <PrivateRoute roles={['OPERADOR', 'ADMIN']}>
                <RegistrarCliente />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {showFooter && <Footer />} {/* Footer fijo al final si no es /login */}
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}
