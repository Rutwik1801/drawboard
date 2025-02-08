import './App.css'
import { SettingsProvider} from './hooks/useSettings';
import { DrawboardView } from './views/DrawboardView';


function App() {
  return (
    <SettingsProvider>
      <DrawboardView />
    </SettingsProvider>
  )
}

export default App
