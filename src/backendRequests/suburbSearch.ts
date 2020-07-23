import debounce from 'debounce-async';
import { PostCodeFileInfo } from '../interfaces';
import AxiosUtils from '../utils/axiosUtils';

const fetchDistrictInfo = async (searchPattern: string) => {
  if (!searchPattern && !searchPattern.length) {
    console.log('Search pattern is empty');
    return null;
  }
  const url = process.env.REACT_APP_PRICES_API_URL + `Districts/${searchPattern}`;

  return await AxiosUtils.fetchWithPromiseTracking<PostCodeFileInfo>(suburbSearchPromiseTrackerArea, url);
};

export const suburbSearchPromiseTrackerArea = 'suburbs';

const fetchDistrictInfoDebounced = debounce(fetchDistrictInfo, 400);

export default fetchDistrictInfoDebounced;
