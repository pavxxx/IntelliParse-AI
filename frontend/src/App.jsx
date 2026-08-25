import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Container from './components/ui/Container';
import Home from './pages/Home';
import Resume from './pages/Resume';
import Library from './pages/Library';
import Chat from './pages/Chat';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="min-h-screen bg-[#444444] text-[#E0E0E0] font-mono selection:bg-[#E0E0E0] selection:text-[#121212] flex flex-col">
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
            <Library
              onSelectResume={() => setActiveTab("resume")}
              setResumeData={setResumeData}
            />
          )}
          {activeTab === 'chat' && (
            <Chat resumeData={resumeData} />
          )}
        </Container>
      </main>

      <footer className="border-t-3 border-[#121212] bg-[#121212] py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-extrabold uppercase tracking-widest text-[#B0B0B0]">
          <div>INTELLIPARSE AI // DOCUMENT ENGINE v1</div>
          <div>by Pavithra</div>
        </div>
      </footer>
    </div>
  );
}

export default App;