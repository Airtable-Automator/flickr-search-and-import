import {
  Heading,
  Box,
  Input,
  Button,
  Text,
  useViewport,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import _ from 'lodash';
import debounce from "lodash.debounce";
import React, { useState } from 'react';
import CSS from 'csstype';

export function SearchResultsView({ appState, setAppState }) {
  const [items, setItems] = useState(appState.state.selection || []);
  const viewport = useViewport();
  // viewport.addMaxFullscreenSize({width: 1501});
  // console.log(appState.state.results)
  // console.log(JSON.stringify(appState.state.results))

  const topbarStyle: CSS.Properties = {
    position: 'fixed',
    backgroundColor: 'white',
    zIndex: 10,
  }
  const selectedImageStyle: CSS.Properties = {
    opacity: 0.5,
    zIndex: 0,
  }
  const unselectedStyle: CSS.Properties = {
  }

  const isPicSelected = (pic) => {
    return _.findIndex(items, function (p) { return p.id === pic.id; }) !== -1;
  }

  const toggleSelectUnselect = (pic) => () => {
    if (isPicSelected(pic)) {
      setItems(items.filter(function (p) { return p.id !== pic.id; }))
    } else {
      setItems(items.concat([pic]));
    }
  }

  const backToSearch = () => {
    const updatedAppState = { ...appState };
    updatedAppState.index = 1;
    setAppState(updatedAppState);
  }

  // window.onscroll = debounce(() => {
  //   const {
  //     loadUsers,
  //     state: {
  //       error,
  //       isLoading,
  //       hasMore,
  //     },
  //   } = this;

  //   // Bails early if:
  //   // * there's an error
  //   // * it's already loading
  //   // * there's nothing left to load
  //   if (error || isLoading || !hasMore) return;

  //   // Checks that the page has scrolled to the bottom
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop
  //     === document.documentElement.offsetHeight
  //   ) {
  //     loadUsers();
  //   }
  // }, 100);

  const reviewItems = () => {
    const updatedAppState = { ...appState };
    updatedAppState.index = 3;
    updatedAppState.state.selection = items;
    setAppState(updatedAppState);
  }

  return (
    <Box>
      <Box display="flex" style={topbarStyle} height={50} borderBottom='thick' width={viewport.size.width} justifyContent="space-between" alignItems="center">
        <Box paddingLeft='10px' display="flex" justifyContent="left">
          <Heading size="large">Showing search results for: {appState.state.search.text}</Heading>
        </Box>
        <Box display="flex" justifyContent="right">
          <Box paddingRight='10px'>
            <Button variant="danger" size="large" onClick={backToSearch}>Back to Search</Button>
          </Box>
          <Box paddingRight='10px'>
            <Button variant="primary" size="large" onClick={reviewItems} disabled={_.isEmpty(items)}>Review {items.length} item(s)</Button>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" paddingTop='50px'>
        {
          appState.state.results.photo.map(pic => {
            const boxStyle = isPicSelected(pic) ? selectedImageStyle : unselectedStyle;
            return (
              <Box width={150} display="flex" alignItems="center" justifyContent="center" key={pic.id} style={boxStyle}>
                <img src={pic.url_q} id={pic.id} onClick={toggleSelectUnselect(pic)} />
              </Box>
            )
          })
        }
      </Box>
      <Box>

      </Box>
    </Box>
  );
}