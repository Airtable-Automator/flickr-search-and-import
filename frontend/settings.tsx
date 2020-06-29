import {
  useGlobalConfig,
} from '@airtable/blocks/ui';
export const FLICKR_API_KEY = "flickrApiKey";

export function useSettings() {
  const globalConfig = useGlobalConfig();

  const apiKey = globalConfig.get(FLICKR_API_KEY) as string;
  const settings = {
    apiKey,
  };

  if (!apiKey || apiKey === "" ) {
    return {
      isValid: false,
      message: 'Enter an API Key to use with Flick API',
      settings,
    };
  }
  return {
    isValid: true,
    settings,
  };
}
