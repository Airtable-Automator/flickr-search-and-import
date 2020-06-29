import {
  Box,
  Text,
  Link,
  FormField,
  Input,
  useViewport,
  useGlobalConfig,
  Heading,
  Button,
  Icon,
} from '@airtable/blocks/ui';
import React, { useState } from 'react';
import { FLICKR_API_KEY } from './settings';

export function Welcome({ appState, setAppState }) {
  // Check if we've Flickr API Key available, if yes, just move onto the next state else 
  // welcome user to the block (probably running it for the first time / a new base installation)
  const globalConfig = useGlobalConfig();
  const apiKeyExists = globalConfig.get(FLICKR_API_KEY) as string;
  const [apiKey, setApiKey] = useState(apiKeyExists);
  console.log(apiKeyExists);

  if (apiKeyExists && apiKeyExists !== "") {
    // move ahead to the next state
    setAppState({ index: 1 });
  }

  const viewport = useViewport();
  const saveSettings = () => {
    globalConfig.setAsync(FLICKR_API_KEY, apiKey);
    setAppState({ index: 1 });
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" border="default" flexDirection="column" width={viewport.size.width} height={viewport.size.height} padding={0}>
      <Box maxWidth='650px'>
        <Box paddingBottom='10px'>
          <Heading size="xlarge">Welcome to Flickr Image Search &amp; Import</Heading>
        </Box>

        <Box paddingBottom='10px'>
          <Text textAlign='justify' size="xlarge">Search and import images from <Link size="xlarge" href="https://www.flickr.com/" target="_blank">Flickr</Link> into your base for collecting image data.</Text>
        </Box>

        <Box paddingBottom='10px'>
          <Text variant="paragraph" textAlign='justify' size="xlarge">To use this block within your base you need to create an API Key. You can obtain this information from <Link size="xlarge" href="https://www.flickr.com/services/apps/create/apply">here</Link>. Depending on the purpose of your usage, you can either create a Non-commercial or Commercial App and use the API Key from that. </Text>
        </Box>

        <Box>
          <FormField label="Flickr API Key">
            <Input value={apiKey} onChange={e => setApiKey(e.target.value)} />
          </FormField>
        </Box>

        <Box>
          <Button icon={<Icon name='premium' fillColor='yellow' />} variant="primary" disabled={!apiKey || apiKey === ""} onClick={saveSettings}>Start Importing</Button>
        </Box>
      </Box>
    </Box>
  );
}
