import { useState,useEffect } from 'react';
import './App.css'
import axiosInstance from './lib/axios'
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
    <div className='min-h-screen w-full flex flex-col bg-yellow-500 text-white items-center justify-center gap-4'>
      <h1 className='text-4xl font-bold'>Freinz</h1>
      <p className='text-lg'>Status: {response || 'Loading...'}</p>
    </div>
  )
}

export default App
