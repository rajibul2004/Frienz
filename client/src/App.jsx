import { useState,useEffect } from 'react';
import './App.css'
import axiosInstance from './lib/axios'
import ThemeSelector from './components/common/ThemeSelector';
function App() {
  const [response, setResponse] = useState(null);

  async function testAPI() {
    try {
      const res = await axiosInstance.get('/health');
      console.log('API Response:', res.data);
      setResponse(res.data.status);
    } catch (error) {
      console.error('API Error:', error);
    }
  }

  useEffect(() => {
    testAPI();
  }, []);

  return (
    <div className='min-h-screen w-full flex flex-col '>
      <ThemeSelector/>
    </div>
  )
}

export default App
