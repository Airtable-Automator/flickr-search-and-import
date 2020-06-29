import {
  Heading,
  Box,
  Button,
  Text,
  useViewport,
  useBase,
  Loader,
} from '@airtable/blocks/ui';
import _ from 'lodash';
import React, { useState, PureComponent } from 'react';
import CSS from 'csstype';
import { FieldType } from '@airtable/blocks/models';
import { createRecordsInBatches } from './utils';

export function ReviewSelection({ appState, setAppState }) {
  const viewport = useViewport();
  const base = useBase();
  const [isLoading, setLoading] = useState(false);

  const itemsToReview = appState.state.selection;

  const topbarStyle: CSS.Properties = {
    position: 'fixed',
    backgroundColor: 'white',
    zIndex: 10,
  }
  const authorTextStye: CSS.Properties = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '200px',
    overflow: 'hidden',
  }

  const settingsSidebarStyle: CSS.Properties = {
    flexFlow: 'column wrap',
    marginTop: '5px',
    marginBottom: '5px',
    justifyContent: "left",
    width: '500px',
    height: '100vh',
  }

  const backToSearch = () => {
    const updatedAppState = { ...appState };
    updatedAppState.index = 2;
    setAppState(updatedAppState);
  }

  const importImages = async () => {
    setLoading(true);
    console.log("Importing " + appState.state.selection.length + " items into the base");
    const nameOfTable = "Flickr Dataset" // Make this configurable with a sensible default
    const fields = [
      { name: 'Title', type: FieldType.SINGLE_LINE_TEXT },
      { name: 'Author', type: FieldType.SINGLE_LINE_TEXT },
      { name: 'Tags', type: FieldType.MULTILINE_TEXT },
      { name: 'Image URL', type: FieldType.URL },
      { name: 'Image', type: FieldType.MULTIPLE_ATTACHMENTS },
    ]

    let table = base.getTableByNameIfExists(nameOfTable);

    if (!table) {
      // TODO: Do this check upfront when the app is starting, to display relevant error message.
      if (base.unstable_hasPermissionToCreateTable(nameOfTable, fields)) {
        await base.unstable_createTableAsync(nameOfTable, fields);
      }
      table = base.getTableByName(nameOfTable);
    }

    const createUnknownRecordCheckResult = table.checkPermissionsForCreateRecord();
    if (!createUnknownRecordCheckResult.hasPermission) {
      alert("TODO: You don't have permissions to insert new records to " + nameOfTable + ".");
      return;
    }

    const newRecords = itemsToReview.map(pic => {
      return {
        fields: {
          'Title': pic.title,
          'Author': pic.ownername,
          'Tags': pic.tags || "",
          'Image URL': pic.url_o || pic.url_z,
          'Image': [{ url: pic.url_o || pic.url_z }],
        },
      }
    });
    console.log(newRecords);
    createRecordsInBatches(table, newRecords);

    setLoading(false);
    const updatedAppState = { ...appState };
    updatedAppState.index = 4;
    setAppState(updatedAppState);
  }

  return (
    <Box>
      <Box display="flex" height={50} borderBottom='thick' width={viewport.size.width} justifyContent="space-between" alignItems="center" style={topbarStyle}>
        <Box paddingLeft='10px'>
          <Heading>Review Selection of {itemsToReview.length} item(s)</Heading>
        </Box>
        <Box display="flex" justifyContent="right">
          <Box paddingRight='10px'>
            <Button variant="danger" size="large" onClick={backToSearch}>Back to Results</Button>
          </Box>
          <Box paddingRight='10px'>
            <Button
              variant="primary"
              size="large"
              icon={isLoading ? <Loader fillColor="#fff" /> : "download"}
              disabled={_.isEmpty(itemsToReview) || isLoading}
              onClick={importImages}>
              Import{isLoading && "ing..."}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box display="flex" paddingTop='50px' marginLeft='10px' marginRight='10px'>
        <Box display="flex" overflow='auto' justifyContent="right">
          <Box display="flex" flexWrap="wrap">
            {
              itemsToReview.map(pic => {
                return (
                  <Box border="thick" width='100%' display="flex" justifyContent="space-between" key={pic.id} marginTop='5px' marginBottom='5px'>
                    <Box paddingTop='10px' paddingLeft='10px' display="block" justifyContent="left">
                      <Heading size="xsmall">{pic.title}</Heading>
                      <Box display="flex" marginTop='3px'>
                        <Box display='block' width='200px' paddingRight='5px'>
                          <Heading variant="caps" size="xsmall" textColor="light">Author</Heading>
                          <Text style={authorTextStye}>{pic.ownername}</Text>
                        </Box>

                        <Box display='block' width={viewport.size.width - (1000)} paddingBottom='10px'>
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
      </Box>
    </Box>
  );
}