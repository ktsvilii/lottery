import { FC } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { FAQ, Game, Home, Tickets } from './pages';
import { FallbackUI, Layout } from './components';

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/game' element={<Game />} />
          <Route path='/tickets' element={<Tickets />} />
          <Route path='*' element={<FallbackUI />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
