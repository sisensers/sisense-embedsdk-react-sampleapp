import { useRef, useState } from 'react'
import { Row, Form, InputGroup, Stack } from 'react-bootstrap'
import SisenseDashboardEmbed from './SisenseEmbedSDK'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const dashboardElement = useRef(null)
  const [sisenseUrl, setSisenseUrl] = useState<string>('')
  const [dashboardId, setDashboardId] = useState<string>('')
  const [showDashboardMenu, setShowDashboardMenu] = useState(false)
  const [showFilterPane, setShowFilterPane] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <Stack direction="horizontal" gap={5}>
          <div className='w-25'>
            <InputGroup size="sm" className="w-75">
              <InputGroup.Text id="">Sisense URL:</InputGroup.Text>
              <Form.Control onChange={(event) => { setSisenseUrl(event.target.value) }} />
            </InputGroup>
          </div>
          <div className='w-25'>
            <InputGroup size="sm">
              <InputGroup.Text id="">Dashboard Id:</InputGroup.Text>
              <Form.Control onChange={(event) => { setDashboardId(event.target.value) }} />
            </InputGroup>
          </div>
          <div className='ms-auto'>
            <Form.Switch id="toggleNavigatorPane" label="Dashboard Menu" checked={showDashboardMenu} onChange={(event) => setShowDashboardMenu(event.target.checked)} />
          </div>
          <div>
            <Form.Switch id="toggleDashboardFilters" label="Filters" checked={showFilterPane} onChange={(event) => setShowFilterPane(event.target.checked)} />
          </div>
          <div>
            <Form.Switch id="toggleDashboardToolbar" label="Toolbar" checked={showToolbar} onChange={(event) => setShowToolbar(event.target.checked)} />
          </div>
        </Stack>
      </header>
      <Row>
        { sisenseUrl !== '' && dashboardId !== '' &&
          <SisenseDashboardEmbed
            ref={dashboardElement}
            sisenseUrl={sisenseUrl}
            dashboardId={dashboardId}
            showLeftPane={showDashboardMenu}
            showRightPane={showFilterPane}
            showToolbar={showToolbar}
          />
        }
      </Row>
    </div>
  );
}

export default App;
