import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Container from './components/ui/Container';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Library from './pages/Library';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#111111] font-mono selection:bg-[#2563EB] selection:text-white flex flex-col">
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />
      <main className="flex-1">
        <Container>
          {activeTab === 'home' && (
            <Home
              onViewResume={() => setActiveTab("resume")}
              setResumeData={setResumeData}
            />
          )}
          {activeTab === 'resume' && (
            <Resume
              resumeData={resumeData}
              onBackToUpload={() => setActiveTab("home")}
            />
          )}
          {activeTab === 'library' && (
            <Library onSelectResume={() => setActiveTab('resume')} />
          )}
        </Container>
      </main>

      <footer className="border-t-3 border-[#111111] bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-extrabold uppercase tracking-widest text-[#111111]/70">
          <div>INTELLIPARSE AI // DOCUMENT ENGINE v1.0.0</div>
          <div>POWERED BY MODERN DIGITAL BRUTALISM</div>
        </div>
      </footer>
    </div>
  );
}

export default App;