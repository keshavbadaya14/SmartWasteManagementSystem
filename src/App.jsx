import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SortWaste from './pages/SortWaste';
import SchedulePickup from './pages/SchedulePickup';
import Login from './components/Login';
import Signup from './components/Signup';
import CommunityChallenges from './components/CommunityChallenges';
import CreateChallenge from './components/CreateChallenge';
import JoinChallenge from './components/JoinChallenge';
import Leaderboard from './components/Leaderboard';
import Recyclable from './components/Recyclable';
import RecyclableQuiz from './components/RecyclableQuiz';
import MasterComposting from './components/MasterComposting';
import OrganicQuiz from './components/OrganicQuiz';
import HandleHazardous from './components/HandleHazardous';
import HazardousQuiz from './components/HazardousQuiz';
import ReduceWaste from './components/ReduceWaste';
import ReduceWasteQuiz from './components/ReduceWasteQuiz';
import ReuseItems from './components/ReuseItems';
import ReuseItemsQuiz from './components/ReuseItemsQuiz';
import EwasteManagement from './components/EwasteManagement';
import EwasteManagementQuiz from './components/EwasteManagementQuiz';
import HandleWaste from './pages/HandleWaste';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sort-waste" element={<SortWaste />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/schedule-pickup" element={<SchedulePickup />} />
        <Route path="/learn-recycling" element={<HandleWaste />} />
        <Route path="/learn/recyclable" element={<Recyclable />} />
        <Route path="/learn/recyclable/quiz" element={<RecyclableQuiz />} />
        <Route path="/learn/organic" element={<MasterComposting />} />
        <Route path="/learn/organic/quiz" element={<OrganicQuiz />} />
        <Route path="/learn/hazardous" element={<HandleHazardous />} />
        <Route path="/learn/hazardous/quiz" element={<HazardousQuiz />} />
        <Route path="/learn/reducewaste" element={<ReduceWaste />} />
        <Route path="/learn/reducewaste/quiz" element={<ReduceWasteQuiz />} />
        <Route path="/learn/reuse" element={<ReuseItems />} />
        <Route path="/learn/reuse/quiz" element={<ReuseItemsQuiz />} />
        <Route path="/learn/ewaste" element={<EwasteManagement />} />
        <Route path="/learn/ewaste/quiz" element={<EwasteManagementQuiz />} />
        <Route path="/community-challenges" element={<CommunityChallenges />} />
        <Route path="/create-challenge" element={<CreateChallenge />} />
        <Route path="/join-challenge" element={<JoinChallenge />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;