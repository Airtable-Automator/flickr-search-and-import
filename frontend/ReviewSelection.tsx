import {
  Heading,
  Box,
  Input,
  Button,
  Text,
  useViewport,
  useGlobalConfig,
  useBase,
} from '@airtable/blocks/ui';
import _ from 'lodash';
import React, { useState } from 'react';
import CSS from 'csstype';

// Airtable SDK limit: we can only update 50 records at a time. For more details, see
// https://github.com/Airtable/blocks/tree/blob/packages/sdk/docs/guide_writes.md#size-limits-rate-limits
const MAX_RECORDS_PER_UPDATE = 50;

export function ReviewSelection({ appState, setAppState }) {
  const viewport = useViewport();
  const base = useBase();

  const topbarStyle: CSS.Properties = {
    position: 'fixed',
    backgroundColor: 'white',
    zIndex: 10,
  }

  const backToSearch = () => {
    const updatedAppState = { ...appState };
    updatedAppState.index = 2;
    setAppState(updatedAppState);
  }

  const importImages = () => {
    console.log("Importing " + appState.state.selection.length + " items into the base");
    // TODO: Do this check upfront when the app is starting, to display relevant error message.
    const createTableCheckResult = base.unstable_checkPermissionsForCreateTable();
    if (!createTableCheckResult.hasPermission) {
      alert(createTableCheckResult.reasonDisplayString);
    }

  }

  return (
    <Box>
      <Box display="flex" height={50} borderBottom='thick' width={viewport.size.width} justifyContent="space-between" alignItems="center" style={topbarStyle}>
        <Box paddingLeft='10px'>
          <Heading>Review Selection of {appState.state.selection.length} item(s)</Heading>
        </Box>
        <Box display="flex" justifyContent="right">
          <Box paddingRight='10px'>
            <Button variant="danger" size="large" onClick={backToSearch}>Back to Results</Button>
          </Box>
          <Box paddingRight='10px'>
            <Button variant="primary" size="large" disabled={_.isEmpty(appState.state.selection)} onClick={importImages}>Import</Button>
          </Box>
        </Box>

      </Box>
      <Box display="flex" flexWrap="wrap" paddingTop='50px' marginLeft='10px' marginRight='10px'>
        {
          appState.state.selection.map(pic => {
            return (
              <Box border="thick" width={viewport.size.width} display="flex" justifyContent="space-between" key={pic.id} marginTop='5px' marginBottom='5px'>
                <Box paddingTop='10px' paddingLeft='10px' display="block" justifyContent="left">
                  <Heading size="xsmall">{pic.title}</Heading>
                  <Box display="flex" marginTop='3px'>
                    <Box display='block' width='200px' paddingRight='5px'>
                      <Heading variant="caps" size="xsmall" textColor="light">Author</Heading>
                      <Text>{pic.ownername}</Text>
                    </Box>

                    <Box display='block' width={viewport.size.width - (500)} paddingBottom='10px'>
                      <Heading variant="caps" size="xsmall" textColor="light">Tags</Heading>
                      <Box display="flex" flexWrap="wrap">
                        {
                          (pic.tags !== "" &&
                            pic.tags.split(" ").map(tag => {
                              return (
                                <Text key={tag} marginRight='2px' paddingLeft='2px' paddingRight='2px' borderRadius="large" backgroundColor="lightGray1" border="default">{tag}</Text>
                              );
                            })) || <Text marginRight='2px' paddingLeft='2px' paddingRight='2px'>N/A</Text>
                        }
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="right" alignItems='center'>
                  <img src={pic.url_q} height={pic.height_q} width={pic.width_q} />
                </Box>
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
}