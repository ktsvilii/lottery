import { FC } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { FallbackUI, Layout } from './components';
import { Admin, FAQ, Game, Home, Tickets } from './pages';

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/game' element={<Game />} />
          <Route path='/tickets' element={<Tickets />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='*' element={<FallbackUI />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
