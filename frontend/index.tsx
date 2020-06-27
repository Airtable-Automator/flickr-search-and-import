import {
    Box,
    Text,
    Button,
    Icon,
    initializeBlock,
    useViewport,
    useBase,
    useGlobalConfig,
    useRecords,
    useLoadable,
    useWatchable,
    TablePickerSynced,
    FieldPickerSynced,
} from '@airtable/blocks/ui';
import React, { useState } from 'react';
import { SearchView } from './SearchView';
import { SearchResultsView } from './SearchResultsView';

// Airtable SDK limit: we can only update 50 records at a time. For more details, see
// https://github.com/Airtable/blocks/tree/blob/packages/sdk/docs/guide_writes.md#size-limits-rate-limits
const MAX_RECORDS_PER_UPDATE = 50;

type AppState = {
    index: number,
    state: object,
}
function ImportImagesFromFlickrBlock() {
    // TODO: Check for API Key, if it exists skip the Welcome Component and move directly to <MainImport />
    const [appState, setAppState] = useState<AppState>({ index: 1, state: {} });

    switch (appState.index) {
        case 0:
            return (<Welcome setAppState={setAppState} appState={appState} />);
        case 1:
            return (<SearchView setAppState={setAppState} />);
        case 2:
            return (<SearchResultsView appState={appState} setAppState={setAppState} />);
        default:
            return (<NotFoundPage appState={appState} />);
    }
}

function Welcome({ appState, setAppState }) {
    const viewport = useViewport();
    const importScreen = () => {
        viewport.enterFullscreenIfPossible();
        setAppState({ index: 1 });
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center" border="default" overflow="hidden" width={viewport.size.width} height={viewport.size.height} padding={0}>
            <Button onClick={importScreen}>Import from Flickr</Button>
        </Box>
    );
}

function NotFoundPage({ appState }) {
    return (
        <Text>Invalid App State Index: {appState.index}, State: {JSON.stringify(appState.state)}</Text>
    );
}

initializeBlock(() => <ImportImagesFromFlickrBlock />);
