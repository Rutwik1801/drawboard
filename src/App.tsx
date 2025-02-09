import './App.css'
import { NotesProvider } from './hooks/useNotes';
import { SettingsProvider} from './hooks/useSettings';
import { DrawboardView } from './views/DrawboardView';


function App() {
  return (
    <SettingsProvider>
      <NotesProvider>
      <DrawboardView />
      </NotesProvider>
    </SettingsProvider>
  )
}

export default App
