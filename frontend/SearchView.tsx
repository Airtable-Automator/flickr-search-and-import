import {
  Box,
  Input,
  Button,
  Loader,
  useViewport,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import React, { useState } from 'react';
import CSS from 'csstype';
import Flickr from 'flickr-sdk';


export function SearchView({ setAppState }) {
  const viewport = useViewport();
  const globalConfig = useGlobalConfig();

  const [isLoading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("cats");
  const searchBoxStyle: CSS.Properties = {
    cursor: 'text'
  }

  const performSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // this size of 1501, comes from showing thumbnails of size 150x150 in the search results.
    viewport.addMaxFullscreenSize({ width: 1501 });

    const flickrApiKey = globalConfig.get('flickrApiKey') as string;
    var flickr = new Flickr(flickrApiKey);
    flickr.photos.search({
      text: searchText,
      page: 1,
      per_page: 50,
      extras: 'owner_name,tags,url_q,url_z,url_o',
    }).then(function (res) {
      viewport.enterFullscreenIfPossible();
      setLoading(false);
      setAppState({
        index: 2,
        state: {
          search: {
            text: searchText,
            page: 1,
            per_page: 100,
          },
          results: res.body.photos,
        }
      });
    }).catch(function (err) {
      setLoading(false);
      console.error('bonk', err);
    });
  }

  return (
    // main box
    <form onSubmit={performSearch}>
      <Box
        width={viewport.size.width}
        height={viewport.size.height}
        display="flex"
        flexDirection='column'
        alignItems="center"
        justifyContent="center"
        padding={0}>
        {
          isLoading &&
          <Box display='block' zIndex={10}><Loader scale={0.5} /></Box>
        }
        <Box width={viewport.size.width / 2} paddingTop='12px' paddingBottom='12px'>
          <Input
            value={searchText}
            size="large"
            onChange={e => setSearchText(e.target.value)}
            placeholder="animals"
            style={searchBoxStyle}
            width='100%'
            disabled={isLoading}
          />
        </Box>
        <Box paddingTop='12px' paddingBottom='12px'>
          <Button size="large" icon='search' onClick={performSearch} disabled={isLoading}>Find Images</Button>
        </Box>
      </Box>
    </form>
  )
}