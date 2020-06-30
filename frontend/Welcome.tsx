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
  Loader,
} from '@airtable/blocks/ui';
import React, { useState, useEffect } from 'react';
import { FLICKR_API_KEY } from './settings';
import Flickr from 'flickr-sdk';

export function Welcome({ appState, setAppState, setIsSettingsVisible }) {
  // Check if we've Flickr API Key available, if yes, just move onto the next state else 
  // welcome user to the block (probably running it for the first time / a new base installation)
  const globalConfig = useGlobalConfig();
  const apiKeyExists = globalConfig.get(FLICKR_API_KEY) as string;
  const [apiKey, setApiKey] = useState(apiKeyExists || "");
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const viewport = useViewport();
  const saveSettings = () => {
    setLoading(true);
    const flickr = new Flickr(apiKey);
    flickr.test.echo({})
      .then(function (res) {
        setLoading(false);
        setErrorMessage("");

        globalConfig.setAsync(FLICKR_API_KEY, apiKey);
        setAppState({ index: 1 });
        setIsSettingsVisible(false);
      }).catch(function (err) {
        setLoading(false);
        setErrorMessage(err.message);
      });
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
        <form onSubmit={saveSettings}>
          <Box>
            <FormField label="Flickr API Key">
              <Input value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </FormField>
          </Box>

          <Box>
            {
              errorMessage !== "" && <Text paddingBottom='5px' textColor='red'>Note: {errorMessage}</Text>
            }
            <Button icon={isLoading && <Loader /> || <Icon name='premium' fillColor='yellow' />} variant="primary" disabled={(!apiKey || apiKey === "") || isLoading} onClick={saveSettings}>Start Importing</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
