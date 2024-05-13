
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// import './index.css';
import App from './App';
import SocketProvider from './context/SocketContext';
import ErrorProvider from './context/ErrorContext';



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <SocketProvider>
    <ErrorProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorProvider>
  </SocketProvider>
);


