import { AutoComplete } from 'rsuite';
import { PostCodeFileInfo } from '../../interfaces';
import React, { useCallback, useEffect, useState } from 'react';
import fetchDistrictInfoDebounced from '../../backendRequests/suburbSearch';
import styles from './SearchBox.module.css';

const SearchBox: React.FunctionComponent = () => {
  const [searchPattern, setSearchPattern] = useState<string>();
  const [data, setData] = useState<string[]>();

  const setDataAsync = useCallback(async () => {
    setData((await fetchDistrictInfoDebounced(searchPattern)).map((x: PostCodeFileInfo) => `${x.state} - ${x.locality} (${x.postCode})`));
  }, [searchPattern]);

  useEffect(() => {
    setDataAsync();
  }, [setDataAsync]);

  return <AutoComplete className={styles.searchBox} data={data} placeholder="Search suburbs" onChange={(value: string) => setSearchPattern(value)} />;
};

export default React.memo(SearchBox);
